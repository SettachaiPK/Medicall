require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const { Server } = require("socket.io");
const { pool } = require("./app/config/db.config");

pool.query("SELECT NOW()", (err, res) => {
  if (res) {
    console.log("connected to postgresql database");
  } else {
    console.log(err);
  }
});

//enable dotenv
require("dotenv").config();

// give permission for fetch resource
// https://acoshift.me/2019/0004-web-cors.html
// https://stackabuse.com/handling-cors-with-node-js/
const CLIENT_URL_REGEX = new RegExp(process.env.CLIENT_URL);
const DOMAIN_URL_REGEX = new RegExp(process.env.DOMAIN);
const corsOptions = {
  origin: [CLIENT_URL_REGEX, DOMAIN_URL_REGEX],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// enabled file upload
app.use(
  fileUpload({
    limits: {
      fileSize: 1000000, //1mb
    },
  })
);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/consultant.routes")(app);

// set port, listen for requests
const port = process.env.SERVER_PORT;
server = app.listen(port, () => console.log("server running on port " + port));
//connect to socketIO

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL_REGEX,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// connection error
io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});
io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("join", (data) => {
    socket.join(data.roomId);
    console.log(`User join to room ${data.roomId}`);
  });

  socket.on("disconnect", (data) => {
    socket.leave(data.roomId);
  });

  socket.on("send-message", (data) => {
    console.log(`send message ${JSON.stringify(data)}`);
    socket.to(data.userId).emit("recieve-message", {
      userId: data.userId,
      message: data.message,
      sender: data.sender,
    });
  });
});

module.exports = app;
