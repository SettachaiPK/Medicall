const { pool } = require("../config/db.config");
require("dotenv").config();

exports.acceptConsultant = async (req, res) => {
  const { userID } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      ` UPDATE consultantDetail 
        SET status = 'active' 
        WHERE "userID" = ($1)`,
      [userID]
    );

    await client.query(
      ` INSERT INTO consultantService ("userID","messagePrice","voiceCallPrice","videoCallPrice")
          VALUES ($1, $2, $3, $4)`,
      [
        userID,
        process.env.BASE_MESSAGE_PRICE,
        process.env.BASE_VOICE_PRICE,
        process.env.BASE_VIDEO_PRICE,
      ]
    );

    const {
      rows: [{ roleID }],
    } = await client.query(
      ` SELECT "roleID" FROM roles WHERE "roleName" = ($1)`,
      [process.env.ROLE_CONSULTANT]
    );
    await client.query(
      ` INSERT INTO userToRole ("userID", "roleID")
          VALUES ($1, $2)`,
      [userID, roleID]
    );

    await client.query("COMMIT");

    return res.status(200).send({
      message: "Consultant activate",
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

exports.rejectConsultant = async (req, res) => {
  const { userID } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: consultantDetail } = await client.query(
      ` SELECT * FROM consultantDetail 
        WHERE "userID" = ($1)
        AND status = 'waiting approval';`,
      [userID]
    );

    if (consultantDetail.length === 0) {
      return res.status(400).send({ message: "No pending application" });
    }

    await client.query(
      ` DELETE FROM consultantDetail
        WHERE "userID" = ($1)
        AND status = 'waiting approval';`,
      [userID]
    );

    await client.query("COMMIT");

    return res.status(200).send({
      message: "Application deleted",
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
