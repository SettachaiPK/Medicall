const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { pool } = require("../config/db.config");

/** Check token by get access token first.
 * Then return the confirm message.
 */
verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    const decoded = jwt.verify(token, config.access_token_secret);
    const {
      rows: [{ status }],
    } = await pool.query(
      ` SELECT status
        FROM userDetail
        WHERE "userID" = ($1);`,
      [decoded.id]
    );

    if (status === "inactive") {
      return res.status(403).send({ message: "User Deactivated." });
    }

    req.userID = decoded.id;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
};

isAdmin = async (req, res, next) => {
  const { userID } = req;
  try {
    const { rows: adminRows } = await pool.query(
      ` SELECT "roleName" 
      FROM userToRole As userRoles
      INNER JOIN roles
      ON roles."roleID" = userRoles."roleID"
      WHERE "userID" = ($1)
      AND "roleName" = 'admin';`,
      [userID]
    );

    if (adminRows.length > 0) {
      return next();
    } else {
      res.status(403).send({ message: "Permission Denied" });
    }
  } catch (err) {
    return res.status(500).send({ message: "internal server error" });
  }
};

isConsultant = async (req, res, next) => {
  const { userID } = req;
  try {
    const { rows: consultantRows } = await pool.query(
      ` SELECT "roleName" 
      FROM userToRole As userRoles
      INNER JOIN roles
      ON roles."roleID" = userRoles."roleID"
      WHERE "userID" = ($1)
      AND "roleName" = 'consultant';`,
      [userID]
    );

    if (consultantRows.length > 0) {
      return next();
    } else {
      res.status(403).send({ message: "Permission Denied" });
    }
  } catch (err) {
    return res.status(500).send({ message: "internal server error" });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isConsultant,
};

module.exports = authJwt;
