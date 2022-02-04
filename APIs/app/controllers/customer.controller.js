const { pool } = require("../config/db.config");
const qs = require("qs");

exports.getOccupation = async (req, res) => {
  try {
    const { rows: occupations } = await pool.query(
      ` SELECT
        DISTINCT ocupation
        FROM consultantDetail
        WHERE ocupation LIKE '%' || $1 || '%';`,
      [req.query.occupation]
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
  try {
    const { rows: departments } = await pool.query(
      ` SELECT
          DISTINCT department
          FROM consultantDetail
          WHERE department LIKE '%' || $1 || '%';`,
      [req.query.department]
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
