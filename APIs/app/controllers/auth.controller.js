const { pool } = require("../config/db.config");
const moment = require("moment");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.requestOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  const client = await pool.connect();
  const nowDate = moment();
  const expiredDate = moment().add(5, "minutes");
  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE OTP 
        SET status = 'cancel' 
        WHERE "phoneNumber" = ($1) AND "status" = 'waiting'`,
      [phoneNumber]
    );

    const password = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const ref = otpGenerator.generate(12, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await client.query(
      ` INSERT INTO OTP ("phoneNumber", "password", "ref", "expiredDate", "createDate") 
        VALUES ($1, $2, $3, $4, $5)`,
      [phoneNumber, password, ref, expiredDate, nowDate]
    );
    await client.query("COMMIT");

    return res.status(200).send({
      phoneNumber,
      password,
      ref,
      expiredDate,
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
  const now = moment();

  try {
    await client.query("BEGIN");
    const { rows: otp } = await client.query(
      ` SELECT * FROM OTP 
        WHERE "phoneNumber" = ($1) 
        AND "status" = 'waiting'
        AND "expiredDate" > ($2)`,
      [req.body.phoneNumber, now]
    );

    if (otp.length > 1) {
      await client.query(
        ` UPDATE OTP 
          SET "status" = 'cancel' 
          WHERE "phoneNumber" = ($1) AND "status" = 'waiting'`,
        [phoneNumber]
      );
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
      ` SELECT * 
        FROM userDetail
        WHERE "phoneNumber" = ($1);`,
      [phoneNumber]
    );

    if (user.length == 0) {
      const { rows: newUser } = await client.query(
        ` INSERT INTO userDetail ("phoneNumber") 
          VALUES ($1) 
          RETURNING *`,
        [phoneNumber]
      );
      user = newUser;
    } else if (user[0].status === "inactive") {
      return res.status(403).send({ message: "User Deactivated!" });
    }

    const accessToken = jwt.sign(
      { id: user[0].userID },
      config.access_token_secret,
      {
        expiresIn: config.access_token_life,
      }
    );
    const refreshToken = jwt.sign(
      { id: user[0].userID },
      config.refresh_token_secret,
      {
        expiresIn: config.refresh_token_life,
      }
    );

    await client.query(
      ` INSERT INTO RefreshToken ("userID", "refreshToken")
        VALUES ($1, $2)
        ON CONFLICT ("userID") DO UPDATE
        SET "refreshToken" = excluded."refreshToken" `,
      [user[0].userID, refreshToken]
    );

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
    await client.query("COMMIT");

    return res.status(200).send(user[0]);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.signUpCustomer = async (req, res) => {
  const {
    userID,
    body: {
      firstName,
      lastName,
      birthDate,
      sex,
      weight,
      height,
      congenitalDisease,
      drugAllergy,
      drugInUse,
    },
  } = req;
  const now = moment();
  const birthDateMoment = moment(birthDate);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const {
      rows: [customerDetail],
    } = await client.query(
      `SELECT * 
        FROM customerDetail
        WHERE "userID" = ($1);`,
      [userID]
    );

    if (customerDetail) {
      return res.status(403).send({ message: "You have already signed up!" });
    }

    await client.query(
      ` UPDATE userDetail 
        SET "status" = 'active',
          "firstName" = ($2),
          "lastName" = ($3),
          "sex" = ($4),
          "birthDate" = ($5),
          "registeredDate" = ($6)
        WHERE "userID" = ($1)`,
      [userID, firstName, lastName, sex, birthDateMoment, now]
    );

    await client.query(
      ` INSERT INTO customerDetail ("userID", "height","weight","congenitalDisease","drugAllergy","drugInUse","registerDate")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userID, height, weight, congenitalDisease, drugAllergy, drugInUse, now]
    );

    const {
      rows: [{ roleID }],
    } = await client.query(
      ` SELECT "roleID" FROM roles WHERE "roleName" = 'customer'`
    );
    console.log(roleID);
    await client.query(
      ` INSERT INTO userToRole ("userID", "roleID")
        VALUES ($1, $2)`,
      [userID, roleID]
    );

    await client.query("COMMIT");
    return res.status(200).send({ msg: "Sign up success" });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
