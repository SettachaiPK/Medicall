const mongoose = require("mongoose");
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        phoneNumber: String,
        refreshToken: String,
        status: { type: Boolean, default: false }
    }, { timestamps: true }).plugin(sanitizerPlugin)
);

module.exports = User;