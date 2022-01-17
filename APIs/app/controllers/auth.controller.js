const config = require("../config/auth.config.js");
const db = require("../models");
const sanitize = require("mongo-sanitize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const User = db.user;
const Test = db.test;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;
const Twilio = require("twilio");
const Account_Balance = db.account_balance;
const client = new Twilio(twilioApiKey, twilioApiSecret, {
  accountSid: accountSid,
});
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: sanitize(req.body.username) });
    if (!user) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Username or Password!",
      });
    }
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Username or Password!",
      });
    }
    const accessToken = jwt.sign({ id: user.id }, config.access_token_secret, {
      expiresIn: config.access_token_life,
    });
    const refreshToken = jwt.sign(
      { id: user.id },
      config.refresh_token_secret,
      {
        expiresIn: config.refresh_token_life,
      }
    );
    if (user.status === false) {
      return res.status(401).send({ message: "User Deactivated!" });
    }
    await user.updateOne({ refresh_token: refreshToken }, []);
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
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
};

exports.detete_cookie = (req, res) => {
  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
    secure: false,
  });
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
    secure: false,
  });
  res.status(200).send({ message: "OK" });
};

exports.testAPI = async (req, res) => {
  try {
    console.log('testAPI');
    const val1 = req.params.val1
    const test = new Test({
      testValue1: val1,
      testValue2: val1,
    });
    await test.save();
    return res.status(200).send({
      testValue1: test.testValue1,
      testValue2: test.testValue2,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.testAPI2 = async (req, res) => {
  try {
    console.log('testAPI2');
    console.log(req.params)
    const val1 = req.params.val1
    
    const test = await Test.find({ testValue1: sanitize(val1) });
    if (!test) {
      return res.status(401).send({
        message: "Invalid!",
      });
    }
    return res.status(200).send({
      test: test
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};