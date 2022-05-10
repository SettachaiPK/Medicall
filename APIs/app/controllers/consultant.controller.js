const { pool } = require("../config/db.config");
const moment = require("moment");
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
    await client.query("BEGIN");

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
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "Consultant not found" });
    }
    tags.forEach((tag, index) => {
      tags[index] = tag.tagName;
    });

    detail.tags = tags;
    //detail.consultantAvatar = detail.consultantAvatar.toString("base64");

    const { rows: reviews } = await client.query(
      ` SELECT "rating", "reason", jobReview."createDate"
      FROM jobReview
      INNER JOIN consultJob 
      ON jobReview."jobID" = consultJob."jobID" 
      WHERE consultJob."consultantID" = $1;`,
      [userID]
    );
    detail.reviews = reviews;
    const ratings = [];
    reviews.forEach((rate) => {
      ratings.push(rate.rating);
    });
    detail.rating =
      ratings.length === 0
        ? null
        : ratings.reduce((a, b) => a + b, 0) / ratings.length;

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

exports.getCustomerDetail = async (req, res) => {
  const { userID } = req;
  const { jobID } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      rows: [jobDetail],
    } = await client.query(
      ` SELECT "birthDate","sex","congenitalDisease","drugAllergy","drugInUse" 
        FROM consultJob       
        INNER JOIN userDetail
        ON userDetail."userID" = consultJob."customerID"
        INNER JOIN customerDetail
        ON customerDetail."userID" = consultJob."customerID"
        WHERE "consultantID" = ($1)
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

exports.jobMeetingEnd = async (req, res) => {
  const { userID } = req;
  const { jobID, advice } = req.body;
  const client = await pool.connect();
  const now = moment();

  try {
    await client.query("BEGIN");

    const {
      rows: [{ meetStartDate }],
    } = await client.query(
      ` SELECT "meetStartDate"
        FROM consultJob
        WHERE "jobID" = ($2) 
        AND "consultantID" = ($1);`,
      [userID, jobID]
    );
    if (!meetStartDate) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    }
    const actualPeriod = moment
      .duration(now.diff(moment(meetStartDate)))
      .asMinutes();
    const {
      rows: [result],
    } = await client.query(
      ` UPDATE consultJob 
        SET "advice" = ($3),"jobStatus" = 'hanged up',"meetEndDate" = $4,"actualPeriod" = $5
        WHERE "jobID" = ($2) 
        AND "consultantID" = ($1)
        RETURNING "jobID";`,
      [userID, jobID, advice, now, actualPeriod]
    );

    await client.query("COMMIT");

    return res
      .status(200)
      .send({ message: "Update advice success", jobID: result.jobID });
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
        ON userDetail."userID" = consultJob."customerID"
        INNER JOIN payment
        ON payment."paymentID" = consultJob."paymentID"
        WHERE "consultantID" = ($1)
        AND "jobID" = ($2);`,
      [userID, jobID]
    );
    if (!jobDetail) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    }
    const { rows: recommendedProducts } = await client.query(
      ` SELECT * 
        FROM consultjobrecommendedproduct       
        INNER JOIN product
        AS "product" USING ("productID")
        LEFT JOIN (
          SELECT DISTINCT on ("productID") 
            "productID", "imageBase64" AS "productMedia"
          FROM   productMedia
          )  AS "productMedia" USING ("productID")
        WHERE "jobID" = ($1)
        AND "isActive" = TRUE;`,
      [jobID]
    );

    await client.query("COMMIT");

    return res.status(200).send({ ...jobDetail, recommendedProducts });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getMeetingDetail = async (req, res) => {
  const { userID } = req;
  const { jobID } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      rows: [jobDetail],
    } = await client.query(
      ` SELECT "firstName","lastName","avatar" 
        FROM consultJob       
        INNER JOIN userDetail
        ON userDetail."userID" = consultJob."customerID"
        WHERE "consultantID" = ($1)
        AND "jobID" = ($2);`,
      [userID, jobID]
    );
    if (!jobDetail) {
      await client.query("ROLLBACK");
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

exports.getCustomerDetail = async (req, res) => {
  const { userID } = req;
  const { jobID } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      rows: [jobDetail],
    } = await client.query(
      ` SELECT "congenitalDisease", "drugAllergy", "drugInUse", "height", "weight", AGE("birthDate"), "sex"
        FROM consultJob       
        INNER JOIN userDetail
        ON userDetail."userID" = consultJob."customerID"
        INNER JOIN customerDetail
        ON customerDetail."userID" = consultJob."customerID"
        WHERE "consultantID" = ($1)
        AND "jobID" = ($2);`,
      [userID, jobID]
    );
    if (!jobDetail) {
      await client.query("ROLLBACK");
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

exports.getProducts = async (req, res) => {
  const client = await pool.connect();
  const { search } = req.query;

  try {
    await client.query("BEGIN");
    console.log(search);
    const { rows: products } = await client.query(
      ` SELECT * 
        FROM product
        INNER JOIN phamarcyDetail
          USING ("storeID")
        LEFT JOIN (
          SELECT DISTINCT on ("productID") 
            "productID", "imageBase64" AS "productMedia"
          FROM   productMedia
          )  AS "productMedia" USING ("productID")
        WHERE "productName" LIKE $1
        AND "isActive" = TRUE
        LIMIT 5`,
      [`%${search}%`]
    );

    await client.query("COMMIT");

    return res.status(200).send(products);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.submitRecommendedProduct = async (req, res) => {
  const { userID } = req;
  const { jobID, recommendedProducts } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      rows: [consultJob],
    } = await client.query(
      ` SELECT *
        FROM consultJob
        WHERE "jobID" = ($2) 
        AND "consultantID" = ($1);`,
      [userID, jobID]
    );
    if (!consultJob) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    }
    const {
      rows: [consultJobRecommendedProduct],
    } = await client.query(
      ` SELECT * 
        FROM consultjobrecommendedproduct
        WHERE "jobID" = $1`,
      [jobID]
    );
    if (consultJobRecommendedProduct) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .send({ message: "Recommended product already exist" });
    }
    if (recommendedProducts) {
      for (var i = 0; i < recommendedProducts.length; i++) {
        const { productID, amount } = recommendedProducts[i];
        if (isNaN(productID)) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .send({ message: "Invalid data type, Allowed number" });
        } else {
          const {
            rows: [product],
          } = await client.query(
            ` SELECT * 
              FROM product
              WHERE "productID" = $1
              AND "isActive" = TRUE;`,
            [productID]
          );
          if (!product) {
            await client.query("ROLLBACK");
            return res.status(400).send({ message: "Product does not exist" });
          }
          await client.query(
            ` INSERT INTO consultJobRecommendedProduct
                ("jobID", "productID", "amount") 
              VALUES ($1, $2, $3);`,
            [jobID, productID, amount]
          );
        }
      }
    }

    await client.query("COMMIT");

    return res
      .status(200)
      .send({ message: "Submit recommended product success", jobID });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.createSchedule = async (req, res) => {
  const { userID } = req;
  let { scheduler } = req.body;
  const client = await pool.connect();
  let scheduleIDToDelete = [];

  try {
    await client.query("BEGIN");
    const result = [];
    const formatDate = scheduler.map(async ({ startDate, endDate }, i) => {
      /* Find schedule with overlapping start time */
      const { rows: startScheduled } = await client.query(
        ` SELECT *
          FROM schedule
          WHERE "startDate" < $2
          AND "endDate" > $2
          AND "consultantID" = ($1)
          ORDER BY "startDate" ASC;`,
        [userID, startDate]
      );
      if (startScheduled.length > 0) {
        /* Extend start date from soonest start date which is overlapping */
        scheduler[i].startDate = moment(startScheduled[0].startDate);
        /* Add id of overlapping schedule to delete array */
        let newScheduleIDToDelete = await startScheduled.map(
          ({ scheduleID }) => scheduleID
        );
        scheduleIDToDelete = scheduleIDToDelete.concat(newScheduleIDToDelete);
      }
      /* Find schedule with overlapping end time */
      const { rows: endScheduled } = await client.query(
        ` SELECT *
          FROM schedule
          WHERE "startDate" < $2
          AND "endDate" > $2
          AND "consultantID" = ($1)
          ORDER BY "endDate" DESC;`,
        [userID, endDate]
      );
      if (endScheduled.length > 0) {
        /* Extend end date from farthest end date which is overlapping */
        scheduler[i].endDate = moment(endScheduled[0].endDate);
        /* Add id of overlapping schedule to delete array */
        let newScheduleIDToDelete = await endScheduled.map(
          ({ scheduleID }) => scheduleID
        );
        scheduleIDToDelete = scheduleIDToDelete.concat(newScheduleIDToDelete);
      }
    });
    await Promise.all(formatDate);

    /* Delete all schedule in delete array */
    await client.query(
      ` DELETE FROM schedule
        WHERE "scheduleID" = ANY($1)`,
      [scheduleIDToDelete]
    );
    /* Insert new schedule */
    const insertNewData = scheduler.map(async ({ startDate, endDate }, i) => {
      const {
        rows: [schedule],
      } = await client.query(
        ` INSERT INTO schedule ("startDate","endDate","consultantID")
          VALUES ($1,$2,$3)
          RETURNING *`,
        [
          moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
          moment(endDate).format("YYYY-MM-DD HH:mm:ss"),
          userID,
        ]
      );
      result.push({
        ...schedule,
        startDate: moment(schedule.startDate).format(),
        endDate: moment(schedule.endDate).format(),
      });
    });
    await Promise.all(insertNewData);

    await client.query("COMMIT");

    return res.status(200).send({ message: "Success", result });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getSchedule = async (req, res) => {
  const { userID } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    /* Query schedule */
    const { rows: schedules } = await client.query(
      ` SELECT *
        FROM schedule
        WHERE "consultantID" = ($1);`,
      [userID]
    );
    /* Format time */
    const result = schedules.map((schedule, i) => {
      return {
        ...schedule,
        startDate: moment(schedule.startDate).format(),
        endDate: moment(schedule.endDate).format(),
      };
    });
    await client.query("COMMIT");
    return res.status(200).send({ message: "Success", result });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.deleteSchedule = async (req, res) => {
  const { userID } = req;
  const { scheduleID } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    /* Query schedule */
    const {
      rows: [schedule],
    } = await client.query(
      ` SELECT *
        FROM schedule
        WHERE "scheduleID" = $1;`,
      [scheduleID]
    );
    /* Return error if schedule not found */
    if (!schedule) {
      await client.query("ROLLBACK");
      return res.status(404).send({ message: "Schedule not found" });
    }
    /* Return error if schedule not belong to this user */
    if (schedule.consultantID !== userID) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    }
    /* Delete schedule */
    await client.query(
      ` DELETE
        FROM schedule
        WHERE "scheduleID" = $1;`,
      [scheduleID]
    );
    await client.query("COMMIT");
    return res.status(200).send({ message: "Success", schedule });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.editSchedule = async (req, res) => {
  const { userID } = req;
  const { scheduleID } = req.params;
  let { endDate, startDate } = req.body;
  const client = await pool.connect();
  if (endDate) {
    endDate = moment(endDate).format();
  }
  if (startDate) {
    startDate = moment(startDate).format();
  }

  try {
    await client.query("BEGIN");
    /* Query schedule */
    const {
      rows: [schedule],
    } = await client.query(
      ` SELECT *
        FROM schedule
        WHERE "scheduleID" = $1;`,
      [scheduleID]
    );
    /* Return error if schedule not found */
    if (!schedule) {
      await client.query("ROLLBACK");
      return res.status(404).send({ message: "Schedule not found" });
    }
    /* Return error if schedule not belong to this user */
    if (schedule.consultantID !== userID) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    }
    /* Return error if schedule not bookable one */
    if (schedule.scheduleStatus !== "bookable") {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .send({ message: "Unable to change this schedule with this type" });
    }
    if (startDate) {
      /* Find schedule with overlapping start time */
      const {
        rows: [startScheduled],
      } = await client.query(
        ` SELECT *
        FROM schedule
        WHERE "startDate" < $2
        AND "endDate" > $2
        AND "consultantID" = ($1)
        AND "scheduleID" != $3
        ORDER BY "startDate" ASC;`,
        [userID, startDate, scheduleID]
      );
      if (startScheduled) {
        await client.query("ROLLBACK");
        return res.status(404).send({ message: "Unable to change start date" });
      }
    }
    if (endDate) {
      /* Find schedule with overlapping end time */
      const {
        rows: [endScheduled],
      } = await client.query(
        ` SELECT *
          FROM schedule
          WHERE "startDate" < $2
          AND "endDate" > $2
          AND "consultantID" = ($1)
          AND "scheduleID" != $3
          ORDER BY "endDate" DESC;`,
        [userID, endDate, scheduleID]
      );
      if (endScheduled) {
        await client.query("ROLLBACK");
        return res.status(404).send({ message: "Unable to change end date" });
      }
    }
    /* Update schedule */
    const dependency = [scheduleID];
    if (startDate) {
      dependency.push(startDate);
    }
    if (endDate) {
      dependency.push(endDate);
    }
    const { rows: updated } = await client.query(
      ` UPDATE schedule
        SET ${
          endDate & startDate
            ? '"startDate" = $2, "endDate" = $3'
            : startDate
            ? `"startDate" = $2`
            : '"endDate" = $2'
        }
        WHERE "scheduleID" = $1
        RETURNING *;`,
      dependency
    );
    await client.query("COMMIT");
    return res.status(200).send({ message: "Success", updated });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getBookedSchedule = async (req, res) => {
  const { userID } = req;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    /* Query booked schedule */
    const { rows: schedules } = await client.query(
      ` SELECT "scheduleID","startDate","endDate","communicationChannel","firstName","lastName","scheduleStatus"
        FROM schedule
        INNER JOIN consultjob
        USING ("scheduleID")
        INNER JOIN userdetail
        ON consultjob."customerID" = userdetail."userID"
        WHERE schedule."consultantID" = ($1)
        AND "scheduleStatus" = 'booked';`,
      [userID]
    );
    /* Format time */
    const result = schedules.map((schedule, i) => {
      return {
        ...schedule,
        startDate: moment(schedule.startDate).format(),
        endDate: moment(schedule.endDate).format(),
      };
    });
    await client.query("COMMIT");
    return res.status(200).send({ message: "Success", result });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    return res.status(500).send(err);
  } finally {
    client.release();
  }
};
