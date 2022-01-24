const config = require("../config/auth.config.js");
const sanitize = require("mongo-sanitize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;
const Twilio = require("twilio");
const pool = require("../config/db.config");

const client = new Twilio(twilioApiKey, twilioApiSecret, {
  accountSid: accountSid,
});

exports.testPostgresql = async (req, res) => {
  console.log("testPostgresql");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "INSERT INTO test (name) VALUES ($1) RETURNING name",
      [req.params.name]
    );
    await client.query("COMMIT");
    console.log(rows);

    return res.status(200).send({
      message: `Added name: ${rows[0].name}`,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.testPostgresqlSelect = async (req, res) => {
  try {
    console.log("testPostgresqlSelect");
    const test = await pool.query("SELECT name FROM test;");

    return res.status(200).send({
      message: test.rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.requestOTP = async (req, res) => {
  try {} catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};