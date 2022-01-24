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
  router.get("/testPostgresql/:name", authController.testPostgresql);
  router.get("/testPostgresqlSelect", authController.testPostgresqlSelect);

  app.use("/apis/auth", router);
};