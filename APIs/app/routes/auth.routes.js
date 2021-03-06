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

  router.get("/", authController.getUser);
  router.post("/requestOTP", authController.requestOTP);
  router.post("/verifyOTP", authController.verifyOTP);
  router.post(
    "/signup/customer",
    authJwt.verifyToken,
    authController.signUpCustomer
  );
  router.post(
    "/signup/consultant",
    authJwt.verifyToken,
    authController.signUpConsultant
  );
  router.post(
    "/signup/phamarcy",
    authJwt.verifyToken,
    authController.signUpPhamarcy
  );
  router.get(
    "/pending-consultant",
    authJwt.verifyToken,
    authController.checkPendingConsultant
  );
  router.get(
    "/pending-phamarcy",
    authJwt.verifyToken,
    authController.checkPendingPhamarcy
  );
  router.get("/logout", authController.detete_cookie);

  app.use("/apis/auth", router);
};
