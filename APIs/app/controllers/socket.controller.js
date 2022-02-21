const { pool } = require("../config/db.config");

exports.userConnect = async (userID, socketID) => {
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
    console.log('making call');
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const {
      rows: [{ consultantSocketID, customerSocketID }],
    } = await client.query(
      ` SELECT consultantSocket."socketID" AS "consultantSocketID" , customerSocket."socketID" AS "customerSocketID"
        FROM consultJob 
        INNER JOIN (SELECT "userID", "socketID" FROM userDetail) AS consultantSocket
            ON consultantSocket."userID" = consultJob."consultantID"
        INNER JOIN (SELECT "userID", "socketID" FROM userDetail) AS customerSocket
            ON customerSocket."userID" = consultJob."customerID"
        WHERE "jobID" = ($1)`,
      [jobID]
    );
    global.io.to(customerSocketID).emit("makeCall", { id: consultantSocketID });
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
  } finally {
    client.release();
  }
};
