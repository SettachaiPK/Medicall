const mongoose = require("mongoose");
const sanitizerPlugin = require("mongoose-sanitizer-plugin");

const Test = mongoose.model(
  "Test",
  new mongoose.Schema(
    {
      testValue1: String,
      testValue2: String,
    },
    { timestamps: true }
  ).plugin(sanitizerPlugin)
);

module.exports = Test;
