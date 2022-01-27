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
      console.log("out");
      return res.status(403).send({ message: "User Deactivated." });
    }

    req.userID = decoded.id;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "internal server error" });
  }
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
