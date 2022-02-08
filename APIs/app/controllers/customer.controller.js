const { pool } = require("../config/db.config");
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
    console.log(departments);
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
    const {
      rows: [detail],
    } = await client.query(
      ` SELECT *
        FROM consultantService AS service
        INNER JOIN (SELECT "userID", "ocupation", "department", "infirmary", "academy" FROM consultantDetail) AS detail
        ON service."userID" = detail."userID"
        WHERE detail."userID" = $1 ;`,
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
      return res.status(400).send({ message: "Consultant not found" });
    }
    tags.forEach((tag, index) => {
      tags[index] = tag.tagName;
    });

    detail.tags = tags;

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
    console.log(tags);
    let occupationParam = occupation ? occupation : "all";
    let departmentParam = department ? department : "all";
    let tagsParam = tags ? tags : "all";
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
          "academy"
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
          (SELECT * FROM ConsultTags 
            WHERE ${tags ? `"tagName" = ANY($3::VARCHAR[])` : "'all' = $3"}) 
          AS tags 
        ON tags."tagID" = serviceToConsultTags."tagID"
        ORDER BY ${orderby === "userID" ? '"userID"' : '"userID"'} DESC
        LIMIT $4
        OFFSET $5;`;

    const { rows: details } = await client.query(queryText, [
      occupationParam,
      departmentParam,
      tagsParam,
      limit,
      offset,
    ]);

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
