const { pool } = require("../config/db.config");

exports.consultingEstablishment = async (jobDetail) => {
  try {
    const consultantSocket = await this.getConnectionID(jobDetail.consultantID);
    const customerSocket = await this.getConnectionID(jobDetail.customerID);
    await global.io.to(customerSocket).emit("invite", {
      destination: consultantSocket,
      type: jobDetail.communicationChannel,
      jobID: jobDetail.jobID,
      role: "customer",
    });
    await global.io.to(consultantSocket).emit("invite", {
      destination: customerSocket,
      type: jobDetail.communicationChannel,
      jobID: jobDetail.jobID,
      role: "consultant",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getConnectionAll = async () => {
  try {
    let users = {};
    for (let [id, socket] of global.io.of("/").sockets) {
      users[socket.userID] = { socketID: id };
    }
    return users;
  } catch (err) {
    console.log(err);
  }
};

exports.getConnectionID = async (userID) => {
  try {
    for (let [id, socket] of global.io.of("/").sockets) {
      if (socket.userID === userID) {
        return socket.id;
      }
    }
    return undefined;
  } catch (err) {
    console.log(err);
  }
};