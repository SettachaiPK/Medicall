module.exports = function (app) {
  var router = require("express").Router();
  const authController = require("../controllers/auth.controller");
  const { authJwt } = require("../middlewares");
  
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/requestOTP", authController.requestOTP);
  router.post("/verifyOTP", authController.verifyOTP);
  router.post("/signUpCustomer", authJwt.verifyToken, authController.signUpCustomer);

  app.use("/apis/auth", router);
};
