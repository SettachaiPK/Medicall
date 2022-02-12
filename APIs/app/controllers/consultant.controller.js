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
  const { detail, messagePrice, voiceCallPrice, videoCallPrice, tags } =
    req.body;
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

    await client.query(
      ` DELETE FROM serviceToConsultTags
        WHERE "userID" = $1`,
      [userID]
    );

    tags.forEach(async (tag) => {
      const {
        rows: [{ tagID }],
      } = await client.query(
        ` INSERT INTO consultTags ("tagName")
          VALUES ($1)
          ON CONFLICT ("tagName") DO UPDATE SET 
          "tagName"=EXCLUDED."tagName" 
          RETURNING  "tagID" `,
        [tag]
      );
      client.query(
        ` INSERT INTO serviceToConsultTags ("tagID","userID")
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING`,
        [tagID, userID]
      );
    });

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

exports.getConsultService = async (req, res) => {
  const { userID } = req;
  const client = await pool.connect();
  try {
    let {
      rows: [detail],
    } = await client.query(
      ` SELECT *
        FROM consultantService AS service
        INNER JOIN (SELECT "userID", "ocupation", "department", "infirmary", "academy" FROM consultantDetail) AS detail
        ON service."userID" = detail."userID"
        INNER JOIN (SELECT "userID", "firstName", "lastName", "sex" FROM userDetail) AS userdetail 
        ON detail."userID" = userdetail."userID"
        WHERE detail."userID" = $1 ;`,
      [userID]
    );

    const { rows: tags } = await client.query(
      ` SELECT *
        FROM consultTags AS tags
        INNER JOIN serviceToConsultTags
        ON tags."tagID" = serviceToConsultTags."tagID"
        WHERE "userID" = $1 ;`,
      [userID]
    );
    if (!detail) {
      return res.status(400).send({ message: "Consultant not found" });
    }
    tags.forEach((tag, index) => {
      tags[index] = tag.tagName;
    });

    detail.tags = tags;
    //detail.consultantAvatar = detail.consultantAvatar.toString("base64");

    await client.query("COMMIT");

    return res.status(200).send(detail);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
