const { pool } = require("../config/db.config");
const moment = require("moment");
const qs = require("qs");

exports.getOccupation = async (req, res) => {
  try {
    // const { rows: occupations } = await pool.query(
    //   ` SELECT
    //     DISTINCT ocupation
    //     FROM consultantDetail
    //     WHERE ocupation LIKE '%' || $1 || '%';`,
    // );
    const { rows: occupations } = await pool.query(
      ` SELECT
        DISTINCT ocupation
        FROM consultantDetail;`
    );
    occupations.forEach((occupation, index) => {
      occupations[index] = {
        title: occupation.ocupation,
        value: occupation.ocupation,
      };
    });

    return res.status(200).send(occupations);
  } catch (err) {
    console.log(err);

    return res.status(500).send(err);
  }
};

exports.getDepartment = async (req, res) => {
  const { occupation } = req.query;
  try {
    const { rows: departments } = await pool.query(
      ` SELECT
          DISTINCT department
          FROM consultantDetail
          WHERE ocupation = $1;`,
      [occupation]
    );

    departments.forEach((department, index) => {
      departments[index] = {
        title: department.department,
        value: department.department,
      };
    });

    return res.status(200).send(departments);
  } catch (err) {
    console.log(err);

    return res.status(500).send(err);
  }
};

exports.getConsultServiceDetail = async (req, res) => {
  const { userid } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const {
      rows: [detail],
    } = await client.query(
      ` SELECT *
        FROM consultantService AS service
        INNER JOIN (SELECT "userID", "ocupation", "department", "infirmary", "academy" FROM consultantDetail) AS detail
        ON service."userID" = detail."userID"
        INNER JOIN (SELECT "userID", "firstName", "lastName", "sex","avatar" FROM userDetail) AS userdetail 
        ON detail."userID" = userdetail."userID"
        WHERE service."userID" = $1 ;`,
      [userid]
    );

    const { rows: tags } = await client.query(
      ` SELECT *
        FROM consultTags AS tags
        INNER JOIN serviceToConsultTags
        ON tags."tagID" = serviceToConsultTags."tagID"
        WHERE "userID" = $1 ;`,
      [userid]
    );
    if (!detail) {
      await client.query("ROLLBACK");
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

exports.getConsultServiceList = async (req, res) => {
  const { occupation, department, tags, orderby, limit, offset } = req.query;
  const client = await pool.connect();
  try {
    let occupationParam = occupation ? occupation : "all";
    let departmentParam = department ? department : "all";
    let tagsParam = tags ? tags : "all";
    /*let queryText = ` SELECT  
        DISTINCT ON (service."userID") 
          service."userID",
          "detail",
          "messagePrice",
          "voiceCallPrice",
          "videoCallPrice",
          "onlineStatus",
          "ocupation",
          "department",
          "infirmary",
          "academy",
          "firstName",
          "lastName",
          "avatar",
          "socketID"
        FROM consultantService AS service
        INNER JOIN 
          (SELECT * FROM consultantDetail 
            WHERE ${occupation ? "ocupation = $1" : "'all' = $1"} 
            AND ${department ? "department = $2" : "'all' = $2"}) 
          AS detail
        ON service."userID" = detail."userID"
        INNER JOIN 
          (SELECT * FROM serviceToConsultTags) 
          AS serviceToConsultTags
        ON service."userID" = serviceToConsultTags."userID"
        INNER JOIN 
          (SELECT * FROM userDetail) 
          AS userDetail
        ON service."userID" = userDetail."userID"
        FULL JOIN 
          (SELECT * FROM ConsultTags 
            WHERE ${tags ? `"tagName" = ANY($3::VARCHAR[])` : "'all' = $3"}) 
          AS tags 
        ON tags."tagID" = serviceToConsultTags."tagID"
        ORDER BY ${orderby === "userID" ? '"userID"' : '"userID"'} DESC
        LIMIT $4
        OFFSET $5;`;

    let { rows: details } = await client.query(queryText, [
      occupationParam,
      departmentParam,
      tagsParam,
      limit,
      offset,
    ]);*/
    let queryText = ` SELECT  
        DISTINCT ON (service."userID") 
          service."userID",
          "detail",
          "messagePrice",
          "voiceCallPrice",
          "videoCallPrice",
          "onlineStatus",
          "ocupation",
          "department",
          "infirmary",
          "academy",
          "firstName",
          "lastName",
          "avatar",
          "socketID"
        FROM consultantService AS service
        INNER JOIN 
          (SELECT * FROM consultantDetail ) 
          AS detail
        ON service."userID" = detail."userID"
        INNER JOIN 
          (SELECT * FROM userDetail) 
          AS userDetail
        ON service."userID" = userDetail."userID"
        ORDER BY ${orderby === "userID" ? '"userID"' : '"userID"'} DESC
        LIMIT $1
        OFFSET $2;`;
    let { rows: details } = await client.query(queryText, [limit, offset]);
    details.forEach((detail) => {
      detail.onlineStatus = detail.socketID ? detail.onlineStatus : "offline";
      delete detail.socketID;
    });

    await client.query("COMMIT");

    return res.status(200).send(details);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getConsultTags = async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows: tags } = await client.query(
      ` SELECT "tagName"
          FROM ConsultTags;`
    );

    tags.forEach((tag, index) => {
      tags[index] = {
        title: tag.tagName,
        value: tag.tagName,
      };
    });

    await client.query("COMMIT");

    return res.status(200).send(tags);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.editAvatar = async (req, res) => {
  const { userID, files } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    if (files) {
      const { media } = await files;
      var image;
      if (media.length) {
        image = media[0];
      } else {
        image = media;
      }
      if (!image.name.match(/\.(jpg|jpeg|png)$/i)) {
        await client.query("ROLLBACK");
        return res.status(415).send({ message: "wrong file type" });
      }
      if (image.truncated) {
        await client.query("ROLLBACK");
        return res.status(413).send({ message: "file too large" });
      }
      await client.query(
        `
        INSERT INTO consultantDetailMedia ("userID", "imageBase64")
        VALUES ($1, $2)`,
        [userID, image.data.toString("base64")]
      );
    }

    return res.status(200).send(departments);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.createConsultJob = async (req, res) => {
  const {
    userID,
    body: {
      schduleDate,
      reservePeriod_m,
      symptomDetail,
      communicationChannel,
      consultantID,
      expectedPrice,
      paymentChannel,
    },
    files,
  } = req;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    if (!["voice", "video"].includes(communicationChannel)) {
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "Invalid communication channel" });
    }
    const {
      rows: [{ basePrice, onlineStatus }],
    } = await client.query(
      `
    SELECT ${
      communicationChannel === "message"
        ? '"messagePrice"'
        : communicationChannel === "voice"
        ? '"voiceCallPrice"'
        : '"videoCallPrice"'
    } AS "basePrice" , "onlineStatus" 
    FROM consultantService 
    WHERE "userID" = $1`,
      [consultantID]
    );
    if ((reservePeriod_m / 15) * basePrice != expectedPrice) {
      return res
        .status(400)
        .send({ message: "Price have been changed.Please try again" });
    }
    const {
      rows: [paymentDetail],
    } = await client.query(
      `
    INSERT INTO payment ("channel", "price","ref1","ref2","createDate","expireDate")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
      [
        paymentChannel,
        expectedPrice,
        "ref1",
        "ref2",
        moment(),
        moment().add(5, "minutes"),
      ]
    );

    if (!schduleDate) {
      if (onlineStatus != "online") {
        await client.query("ROLLBACK");
        return res.status(400).send({ message: "Consultant not online" });
      }
    }

    const {
      rows: [jobDetail],
    } = await client.query(
      `
    INSERT INTO consultJob 
      ("schduleDate", "reservePeriod_m","symptomDetail","communicationChannel","consultantID","customerID","paymentID")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
      [
        schduleDate,
        reservePeriod_m,
        symptomDetail,
        communicationChannel,
        consultantID,
        userID,
        paymentDetail.paymentID,
      ]
    );

    if (files) {
      const { media } = await files;
      var images = [];
      if (media.length) {
        images = media;
      } else {
        images = [media];
      }
      images.forEach(async (image) => {
        if (!image.name.match(/\.(jpg|jpeg|png)$/i)) {
          await client.query("ROLLBACK");
          return res.status(415).send({ message: "wrong file type" });
        }
        if (image.truncated) {
          await client.query("ROLLBACK");
          return res.status(413).send({ message: "file too large" });
        }
        await client.query(
          `
        INSERT INTO symptomMedia ("jobID", "imageBase64")
        VALUES ($1, $2)`,
          [jobDetail.jobID, image.data.toString("base64")]
        );
      });
    }

    await client.query("COMMIT");
    return res.status(200).send({ jobDetail, paymentDetail });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getMeetingSummary = async (req, res) => {
  const { userID } = req;
  const { jobID } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      rows: [jobDetail],
    } = await client.query(
      ` SELECT "firstName","lastName","avatar","price","advice" ,"meetStartDate" ,"communicationChannel" ,"actualPeriod" 
        FROM consultJob       
        INNER JOIN userDetail
        ON userDetail."userID" = consultJob."consultantID"
        INNER JOIN payment
        ON payment."paymentID" = consultJob."paymentID"
        WHERE "customerID" = ($1)
        AND "jobID" = ($2);`,
      [userID, jobID]
    );
    if (!jobDetail) {
      res.status(403).send({ message: "Permission Denied" });
    }

    await client.query("COMMIT");

    return res.status(200).send(jobDetail);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

