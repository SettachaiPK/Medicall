const { pool } = require("../config/db.config");
const moment = require("moment");
const socketController = require("./socket.controller");

exports.confirmPayment = async (req, res) => {
  const { paymentID } = req.body;
  const client = await pool.connect();
  const now = moment();

  try {
    await client.query("BEGIN");

    const { rows: payment } = await client.query(
      `SELECT "paymentStatus"
          FROM payment 
          WHERE "paymentID" = ($1)`,
      [paymentID]
    );
    if (!payment.length) {
      return res.status(400).send({ message: "Payment does not exist" });
    }
    const currentPayment = payment[0];
    if (currentPayment.paymentStatus != "created") {
      return res.status(400).send({
        message: `Unable to confirm payment, Current status ${currentPayment.paymentStatus}`,
      });
    }

    await client.query(
      `UPDATE payment 
        SET "paymentStatus" = 'paid',
        "confirmDate"=($2)
        WHERE "paymentID" = ($1)
        RETURNING "paymentID"`,
      [paymentID, now]
    );
    const {
      rows: [{ schduleDate, jobID }],
    } = await client.query(
      `UPDATE consultJob 
        SET "jobStatus" = 'paid'
        WHERE "paymentID" = ($1)
        AND "jobStatus" = 'created'
        RETURNING "schduleDate","jobID"`,
      [paymentID]
    );
    if (!schduleDate) {
      await client.query(
        `UPDATE consultJob 
        SET "schduleDate" = ($2)
        WHERE "paymentID" = ($1)`,
        [paymentID, now]
      );
      socketController.makeCall(jobID);
    }

    await client.query("COMMIT");
    return res.status(200).send({
      message: `Payment ${paymentID} status updated, Job ${jobID} status updated`,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
