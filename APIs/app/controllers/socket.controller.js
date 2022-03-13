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

/*exports.userConnect = async (userID, socketID) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE userDetail 
          SET "socketID" = NULL
          WHERE "socketID" = ($1)`,
      [socketID]
    );
    await client.query(
      ` UPDATE userDetail 
          SET "socketID" = ($2)
          WHERE "userID" = ($1)`,
      [userID, socketID]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
  } finally {
    client.release();
  }
};

exports.userDisconnect = async (socketID) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE userDetail 
            SET "socketID" = NULL
            WHERE "socketID" = ($1)`,
      [socketID]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
  } finally {
    client.release();
  }
};

exports.makeCall = async (jobID) => {
  console.log("making call");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const {
      rows: [
        {
          consultantSocketID,
          customerSocketID,
          communicationChannel,
          consultantFirstName,
          consultantLastName,
          customerFirstName,
          customerLastName,
          reservePeriod_m
        },
      ],
    } = await client.query(
      ` SELECT 
          consultantSocket."socketID" AS "consultantSocketID" , 
          customerSocket."socketID" AS "customerSocketID", 
          "communicationChannel",
          consultantSocket."firstName" AS "consultantFirstName" , 
          consultantSocket."lastName" AS "consultantLastName" , 
          customerSocket."firstName" AS "customerFirstName" , 
          customerSocket."lastName" AS "customerLastName" ,
          "reservePeriod_m"
        FROM consultJob 
        INNER JOIN (SELECT "userID", "socketID", "firstName", "lastName" FROM userDetail) AS consultantSocket
            ON consultantSocket."userID" = consultJob."consultantID"
        INNER JOIN (SELECT "userID", "socketID", "firstName", "lastName" FROM userDetail) AS customerSocket
            ON customerSocket."userID" = consultJob."customerID"
        WHERE "jobID" = ($1)`,
      [jobID]
    );
    global.io.to(customerSocketID).emit("invite", {
      destinationSocket: consultantSocketID,
      destinationName: `${consultantFirstName} ${consultantLastName}`,
      type: communicationChannel,
      jobID,
      role: "customer",
      reservePeriod_m
    });
    global.io.to(consultantSocketID).emit("invite", {
      destinationSocket: customerSocketID,
      destinationName: `${customerFirstName} ${customerLastName}`,
      type: communicationChannel,
      jobID,
      role: "consultant",
      reservePeriod_m
    });
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
  } finally {
    client.release();
  }
};

exports.userClear = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE userDetail 
            SET "socketID" = NULL`
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
  } finally {
    client.release();
  }
};

exports.jobMeetingStart = async (jobID, now) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE consultJob 
            SET "jobStatus" = 'meeting',
            "meetStartDate" = $2
        WHERE "jobID" = $1
        AND "jobStatus" = 'paid';`,
      [jobID, now]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
  } finally {
    client.release();
  }
};*/
