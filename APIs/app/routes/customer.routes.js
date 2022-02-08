module.exports = function (app) {
  var router = require("express").Router();
  const customerController = require("../controllers/customer.controller");
  const { authJwt } = require("../middlewares");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get(
    "/occupation",
    [authJwt.verifyToken],
    customerController.getOccupation
  );
  router.get(
    "/department",
    [authJwt.verifyToken],
    customerController.getDepartment
  );

  router.get(
    "/consult-service/:userid",
    customerController.getConsultServiceDetail
  );

  router.get(
    "/consult-service",
    customerController.getConsultServiceList
  );

  app.use("/apis/customer", router);
};
