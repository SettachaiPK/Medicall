const { pool } = require("../config/db.config");
const moment = require("moment");
const otpGenerator = require("otp-generator");


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
    const expDate = moment().add(1, "minutes");

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
  const client = await pool.connect();
  try {
    const now = moment();

    await client.query("BEGIN");
    const { rows } = await client.query(
      ` SELECT * FROM OTP 
        WHERE phoneNumber = ($1) 
        AND status = 'waiting'
        AND expiredDate > ($2)`,
      [req.body.phoneNumber, now]
    );
    await client.query("COMMIT");

    if (rows.length > 1) {
      await client.query("BEGIN");
      await client.query(
        ` UPDATE OTP 
          SET status = 'cancel' 
          WHERE phoneNumber = ($1) AND status = 'waiting'`,
        [req.body.phoneNumber]
      );
      await client.query("COMMIT");
      return res
        .status(400)
        .send({ message: "Wrong password or password has been expired" });
    }

    if (rows.length == 0 || rows[0].password != req.body.password) {
      return res
        .status(400)
        .send({ message: "Wrong password or password has been expired" });
    }

    return res.status(200).send({
      mes: "yes",
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
