const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

/** Check token by get access token first.
 * Then return the confirm message.
 */
verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(403).send({message: "No token provided!"});
        }
        const decoded = jwt.verify(token, config.access_token_secret)
        const user = await User.findById(decoded.id)
        if (user.status) {
            req.userId = decoded.id;
            return next();
        }
        return res.status(403).send({message: "User Deactivated."});
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({message: "internal server error"});
    }
};

const authJwt = {
    verifyToken
};

module.exports = authJwt;
