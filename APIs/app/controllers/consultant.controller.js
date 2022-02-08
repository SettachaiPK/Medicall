const { pool } = require("../config/db.config");
require("dotenv").config();

exports.editOnlineStatus = async (req, res) => {
  const { onlineStatus } = req.body;
  const { userID } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE consultantService 
        SET "onlineStatus" = $2
        WHERE "userID" = ($1)`,
      [userID, onlineStatus]
    );

    await client.query("COMMIT");

    return res.status(200).send({
      message: `Update online status to ${onlineStatus}`,
      userID,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.editConsultantService = async (req, res) => {
  const { detail, messagePrice, voiceCallPrice, videoCallPrice } = req.body;
  const { userID } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const {
      rows: [consultantService],
    } = await client.query(
      ` UPDATE consultantService 
        SET "detail" = $2, "messagePrice" = $3,"voiceCallPrice" = $4,"videoCallPrice" = $5
        WHERE "userID" = ($1)
        RETURNING "detail","messagePrice","voiceCallPrice","videoCallPrice";`,
      [userID, detail, messagePrice, voiceCallPrice, videoCallPrice]
    );

    await client.query("COMMIT");

    return res.status(200).send({
      consultantService,
      userID,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
