const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user/user.model");
db.test = require("./test.model");

module.exports = db;