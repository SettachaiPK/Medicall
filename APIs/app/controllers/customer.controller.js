const { pool } = require("../config/db.config");
const moment = require("moment");
const qs = require("qs");
const {
  getConnectionID,
  consultingEstablishment,
} = require("./socket.controller");

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
    if (!detail) {
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "Consultant not found" });
    }

    const { rows: tags } = await client.query(
      ` SELECT *
        FROM consultTags AS tags
        INNER JOIN serviceToConsultTags
        ON tags."tagID" = serviceToConsultTags."tagID"
        WHERE "userID" = $1 ;`,
      [userid]
    );
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
      [userid]
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
          "rating"
        FROM consultantService AS service
        INNER JOIN 
          (SELECT * FROM consultantDetail ) 
          AS detail
        ON service."userID" = detail."userID"
        INNER JOIN 
          (SELECT * FROM userDetail) 
          AS userDetail
        ON service."userID" = userDetail."userID"
        LEFT JOIN 
          ( SELECT AVG("rating") AS "rating","consultantID" 
            FROM consultJob 
            INNER JOIN jobReview
            ON jobReview."jobID" = consultJob."jobID"
            GROUP BY "consultantID"
          ) 
          AS review
        ON review."consultantID" = userDetail."userID"
        ORDER BY ${orderby === "userID" ? '"userID"' : '"userID"'} DESC
        LIMIT $1
        OFFSET $2;`;
    let { rows: details } = await client.query(queryText, [limit, offset]);
    details.forEach(async (detail) => {
      const socketID = await getConnectionID(detail.userID);
      detail.onlineStatus = (await socketID) ? detail.onlineStatus : "offline";
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

exports.createConsultJobNow = async (req, res) => {
  let {
    userID,
    body: {
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

    if (onlineStatus != "online") {
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "Consultant not online" });
    }

    const {
      rows: [jobDetail],
    } = await client.query(
      `
    INSERT INTO consultJob 
      ("schduleDate", "reservePeriod_m","symptomDetail","communicationChannel","consultantID","customerID","paymentID","jobStatus")
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid')
    RETURNING *`,
      [
        moment(),
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
    await consultingEstablishment(jobDetail);
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
        ON userDetail."userID" = consultJob."consultantID"
        WHERE "customerID" = ($1)
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
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    }
    const { rows: recommendedProducts } = await client.query(
      ` SELECT * 
        FROM consultjobrecommendedproduct       
        INNER JOIN product
        AS "product" USING ("productID") 
        INNER JOIN (
          SELECT "storeName","storeID" 
          FROM phamarcydetail
        )
        AS "storeDetail" USING ("storeID")
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

exports.jobMeetingStart = async (req, res) => {
  const { userID } = req;
  const { jobID } = req.body;
  const client = await pool.connect();
  const now = moment();
  try {
    await client.query("BEGIN");
    const {
      rows: [result],
    } = await client.query(
      ` UPDATE consultJob 
            SET "jobStatus" = 'meeting',
            "meetStartDate" = $2
        WHERE "jobID" = $1
        AND "jobStatus" = 'paid'
        AND "customerID" = $3
        RETURNING "meetStartDate", "reservePeriod_m";`,
      [jobID, now, userID]
    );

    if (!result) {
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "Unable to start meeting" });
    }

    await client.query("COMMIT");

    return res.status(200).send({ message: "job start", result });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.jobMeetingEnd = async (req, res) => {
  const { jobID } = req.body;
  const client = await pool.connect();
  const now = moment();
  try {
    await client.query("BEGIN");

    const {
      rows: [result],
    } = await client.query(
      ` UPDATE consultJob 
            SET "jobStatus" = 'hanged up',
            "meetEndDate" = $2
        WHERE "jobID" = $1
        AND "jobStatus" = 'meeting'
        RETURNING "meetStartDate", "meetEndDate";`,
      [jobID, now]
    );

    if (!result) {
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "Unable to end meeting" });
    }

    const actualPeriod = moment
      .duration(moment(result.meetEndDate).diff(moment(result.meetStartDate)))
      .asMinutes();

    await client.query(
      ` UPDATE consultJob 
            SET "actualPeriod" = $2
        WHERE "jobID" = $1;`,
      [jobID, actualPeriod]
    );

    await client.query("COMMIT");

    return res.status(200).send({ message: "job ended", result });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.giveServiceReview = async (req, res) => {
  const { userID } = req;
  const { jobID, rating, reason } = req.body;
  const client = await pool.connect();
  const now = moment();
  try {
    await client.query("BEGIN");

    const {
      rows: [consultJob],
    } = await client.query(
      ` UPDATE consultJob
        SET  "jobStatus" = 'finished'
        WHERE "jobID" = $1
        AND "customerID" = $2
        AND "jobStatus" = 'hanged up'
        RETURNING *;`,
      [jobID, userID]
    );
    if (!consultJob) {
      await client.query("ROLLBACK");
      return res
        .status(403)
        .send({ message: "Job not foud or Permission denied" });
    }

    const {
      rows: [{ jobReviewID }],
    } = await client.query(
      ` INSERT INTO jobReview ("jobID", "rating","reason","createDate")
        VALUES ($1, $2, $3, $4)
        RETURNING "jobReviewID"`,
      [jobID, rating, reason, now]
    );
    if (!jobReviewID) {
      await client.query("ROLLBACK");
      return res.status(400).send({ message: "Unable to create review" });
    }

    await client.query("COMMIT");

    return res.status(200).send({ message: "Review Created", jobReviewID });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.placeOrder = async (req, res) => {
  const { userID } = req;
  const {
    orderDescription,
    deliveryLocation,
    deliveryChannel,
    storeID,
    items,
  } = req.body;
  const client = await pool.connect();
  const now = moment();
  let totalPrice = 0;
  try {
    await client.query("BEGIN");

    const {
      rows: [{ orderID }],
    } = await client.query(
      ` INSERT INTO productOrder
          ("orderDescription", "deliveryLocation", "deliveryChannel", "storeID", "customerID", "createDate")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING "orderID";`,
      [
        orderDescription,
        deliveryLocation,
        deliveryChannel,
        storeID,
        userID,
        now,
      ]
    );

    if (!items || items.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .send({ message: "Unable to create order with no item" });
    } else {
      for (var i = 0; i < items.length; i++) {
        const { productID, amount } = items[i];
        if (isNaN(productID) || isNaN(amount)) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .send({ message: "Invalid data type, Allowed integer" });
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
          if (String(product.storeID) !== String(storeID)) {
            console.log(product.storeID, storeID);
            await client.query("ROLLBACK");
            return res
              .status(400)
              .send({ message: "Product does not belong to this store" });
          }
          await client.query(
            ` INSERT INTO productOrderToProduct
                ("orderID", "productID", "pricePerPiece", "amount")
              VALUES ($1, $2, $3, $4);`,
            [orderID, productID, product.productPrice, amount]
          );
          totalPrice += product.productPrice * amount;
        }
      }
      await client.query(
        ` UPDATE productOrder
          SET "totalPrice" = $1
          WHERE "orderID" = $2;`,
        [totalPrice, orderID]
      );
    }

    await client.query("COMMIT");

    return res.status(200).send({ message: "Order Created", orderID });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);
    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getOrders = async (req, res) => {
  const { userID } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: productorder } = await client.query(
      ` SELECT *
        FROM productorder
        INNER JOIN (
          SELECT "storeID" , "storeName"
          FROM phamarcyDetail
        ) AS "phamarcyDetail" USING ("storeID")
        LEFT JOIN (
          SELECT "orderID", array_agg(json_build_object(
            'productID', "productID", 
            'pricePerPiece', "pricePerPiece", 
            'amount', "amount", 
            'productName', "productName", 
            'productMedia', "productMedia"
          )) AS "products"
          FROM   productordertoproduct
          INNER JOIN product
          AS product USING("productID")
          LEFT JOIN (
            SELECT DISTINCT on ("productID") 
              "productID", "imageBase64" AS "productMedia"
            FROM   productMedia
            )  AS "productMedia" USING ("productID")
          WHERE "isActive" = TRUE
          GROUP BY "orderID"
          ) AS "productordertoproduct" USING ("orderID")
        WHERE "customerID" = ($1);`,
      [userID]
    );
    if (!productorder) {
      await client.query("ROLLBACK");
      res.status(403).send({ message: "Permission Denied" });
    }

    await client.query("COMMIT");

    return res.status(200).send(productorder);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getOrderdetail = async (req, res) => {
  const {
    userID,
    params: { orderID },
  } = req;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      rows: [productorder],
    } = await client.query(
      ` SELECT *
        FROM productorder
        INNER JOIN (
          SELECT "storeID" , "storeName"
          FROM phamarcyDetail
        ) AS "phamarcyDetail" USING ("storeID")
        LEFT JOIN (
          SELECT "orderID", array_agg(json_build_object(
            'productID', "productID", 
            'pricePerPiece', "pricePerPiece", 
            'amount', "amount", 
            'productName', "productName", 
            'productMedia', "productMedia"
          )) AS "products"
          FROM   productordertoproduct
          INNER JOIN product
          AS product USING("productID")
          LEFT JOIN (
            SELECT DISTINCT on ("productID") 
              "productID", "imageBase64" AS "productMedia"
            FROM   productMedia
            )  AS "productMedia" USING ("productID")
          WHERE "isActive" = TRUE
          GROUP BY "orderID"
          ) AS "productordertoproduct" USING ("orderID")
        WHERE "customerID" = ($1)
        AND "orderID" = $2;`,
      [userID, orderID]
    );
    if (!productorder) {
      await client.query("ROLLBACK");
      res.status(403).send({ message: "Permission Denied" });
    }

    await client.query("COMMIT");

    return res.status(200).send(productorder);
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.confirmReceiveOrder = async (req, res) => {
  const {
    userID,
    body: { orderID },
  } = req;
  const client = await pool.connect();
  const now = moment();

  try {
    await client.query("BEGIN");

    const {
      rows: [productorder],
    } = await client.query(
      ` SELECT "orderStatus"
        FROM productorder
        WHERE "customerID" = ($1)
        AND "orderID" = $2;`,
      [userID, orderID]
    );
    if (!productorder) {
      await client.query("ROLLBACK");
      return res.status(403).send({ message: "Permission Denied" });
    } else if (productorder.orderStatus !== "shipped") {
      await client.query("ROLLBACK");
      return res.status(403).send({
        message: `Can not set status of this order, Current status '${productorder.orderStatus}'`,
      });
    }
    client.query(
      ` UPDATE productorder
        SET 
          "orderStatus" = 'received',
          "receiveDate" = $1
        WHERE "orderID" = $2;`,
      [now, orderID]
    );

    await client.query("COMMIT");

    return res.status(200).send({ message: "Success", orderID });
  } catch (err) {
    await client.query("ROLLBACK");

    console.log(err);

    return res.status(500).send(err);
  } finally {
    client.release();
  }
};

exports.getConsultantSchedule = async (req, res) => {
  const { consultantID } = req.params;
  const client = await pool.connect();
  const tomorrow = moment()
    .add(1, "days")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  try {
    await client.query("BEGIN");
    /* Query schedule */
    const { rows: schedules } = await client.query(
      ` SELECT *
        FROM schedule
        WHERE "consultantID" = ($1)
        AND "endDate" > $2
        ORDER BY "startDate";`,
      [consultantID, tomorrow]
    );
    /* Format and boundary date */
    const result = schedules.map((schedule, i) => {
      return {
        ...schedule,
        startDate:
          moment(schedule.startDate) > tomorrow
            ? moment(schedule.startDate).format()
            : tomorrow.format(),
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
