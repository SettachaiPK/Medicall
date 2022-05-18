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
    console.log("Can not connect to postgresql database ", err);
  }
});

//enable dotenv
require("dotenv").config();

//enable cron
require("./app/cron/cron-jobs");

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
require("./app/routes/pharmacy.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/external.routes")(app);

// set port, listen for requests
const port = process.env.SERVER_PORT;

const server = app.listen(port, () =>
  console.log("server running on port " + port)
);

//connect to socketIO

const socketController = require("./app/controllers/socket.controller");
// socketController.userClear();

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL_REGEX,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io; //added

// connection error
io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

io.use((socket, next) => {
  const userID = socket.handshake.auth.userID;
  if (!userID) {
    return next(new Error("invalid userID"));
  }
  socket.userID = userID;
  console.log(`user ${userID} connected`);
  next();
});

io.on("connection", (socket) => {
  socket.on("disconnect", async () => {
    console.log(`user ${socket.userID} disconnected`);
  });
  socket.on("acceptCall", ({ to, jobID }) => {
    socket.to(to).emit("acceptCall", jobID);
  });
  socket.on("leaveCall", ({ to }) => {
    socket.to(to).emit("leaveCall", {});
  });
  socket.on("fireStream", ({ userToCall, signalData }) => {
    io.to(userToCall).emit("receiveStream", { signalData });
  });
});

// io.on("connection", (socket) => {
//   socket.emit("me", socket.id);

//   socket.on("user", ({ userID }) => {
//     socketController.userConnect(userID, socket.id);
//   });

//   socket.on("disconnect", (data) => {
//     socketController.userDisconnect(socket.id);
//     socket.leave(data.roomId);
//   });

//   socket.on("userReady", ({ to }) => {
//     io.to(to).emit("userReady", {});
//   });

//   socket.on("answerCall", (data) => {
//     socketController.jobMeetingStart(data.jobID, data.meetStartDate);
//     console.log("answerCall", data.to);
//     io.to(data.to).emit("callAccepted", {
//       signal: data.signal,
//       meetStartDate: data.meetStartDate,
//     });
//   });
//   socket.on("leaveCall", (data) => {
//     io.to(data.to).emit("leaveCall", {});
//   });

//   /*socket.on("join", (data) => {
//     socket.join(data.roomId);
//     console.log(`User join to room ${data.roomId}`);
//   });

//   socket.on("send-message", (data) => {
//     console.log(`send message ${JSON.stringify(data)}`);
//     socket.to(data.userId).emit("recieve-message", {
//       userId: data.userId,
//       message: data.message,
//       sender: data.sender,
//     });
//   });*/
// });

module.exports = { app, server };
