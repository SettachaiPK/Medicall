const { pool } = require("../config/db.config");
const moment = require("moment");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.requestOTP = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE OTP 
        SET status = 'cancel' 
        WHERE phoneNumber = ($1) AND status = 'waiting'`,
      [req.body.phoneNumber]
    );
    await client.query("COMMIT");

    const nowDate = moment();
    const expDate = moment().add(5, "minutes");

    const password = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const ref = otpGenerator.generate(12, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await client.query("BEGIN");
    const { rows } = await client.query(
      ` INSERT INTO OTP (phoneNumber, password, ref, expiredDate, createDate) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING phoneNumber,ref,expiredDate`,
      [req.body.phoneNumber, password, ref, expDate, nowDate]
    );
    await client.query("COMMIT");

    return res.status(200).send({
      phoneNumber: rows[0].phonenumber,
      password,
      ref: rows[0].ref,
      expiredDate: rows[0].expireddate,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.verifyOTP = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const client = await pool.connect();

  try {
    const now = moment();

    await client.query("BEGIN");
    const { rows: otp } = await client.query(
      ` SELECT * FROM OTP 
        WHERE phoneNumber = ($1) 
        AND status = 'waiting'
        AND expiredDate > ($2)`,
      [req.body.phoneNumber, now]
    );
    await client.query("COMMIT");

    if (otp.length > 1) {
      await client.query("BEGIN");
      await client.query(
        ` UPDATE OTP 
          SET status = 'cancel' 
          WHERE phoneNumber = ($1) AND status = 'waiting'`,
        [phoneNumber]
      );
      await client.query("COMMIT");
      return res
        .status(401)
        .send({ message: "Wrong password or password has been expired" });
    }
    if (otp.length == 0 || otp[0].password != password) {
      return res
        .status(401)
        .send({ message: "Wrong password or password has been expired" });
    }

    let { rows: user } = await client.query(
      `SELECT * 
      FROM userDetail
      WHERE phoneNumber = ($1);`,
      [phoneNumber]
    );

    if (user.length == 0) {
      await client.query("BEGIN");
      const { rows: newUser } = await client.query(
        ` INSERT INTO userDetail (phoneNumber) 
        VALUES ($1) 
        RETURNING *`,
        [phoneNumber]
      );
      await client.query("COMMIT");
      user = newUser;
    } else if (user[0].status === "inactive") {
      return res.status(403).send({ message: "User Deactivated!" });
    }

    const accessToken = jwt.sign(
      { id: user[0].userid },
      config.access_token_secret,
      {
        expiresIn: config.access_token_life,
      }
    );
    const refreshToken = jwt.sign(
      { id: user[0].userid },
      config.refresh_token_secret,
      {
        expiresIn: config.refresh_token_life,
      }
    );

    await client.query("BEGIN");
    await client.query(
      ` INSERT INTO RefreshToken (userID, refreshToken) 
      VALUES ($1, $2) 
      RETURNING *`,
      [user[0].userid, refreshToken]
    );
    await client.query("COMMIT");

    res.cookie("refreshToken", refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_LIFE,
      httpOnly: false,
      secure: false,
    });
    res.cookie("accessToken", accessToken, {
      maxAge: process.env.ACCESS_TOKEN_LIFE,
      httpOnly: true,
      secure: false,
    });

    return res.status(200).send(user[0]);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
