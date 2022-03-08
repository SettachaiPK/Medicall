module.exports = function (app) {
  var router = require("express").Router();
  const consultantController = require("../controllers/consultant.controller");
  const { authJwt } = require("../middlewares");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post(
    "/online-status",
    [authJwt.verifyToken, authJwt.isConsultant],
    consultantController.editOnlineStatus
  );

  router.post(
    "/service",
    [authJwt.verifyToken, authJwt.isConsultant],
    consultantController.editConsultantService
  );

  router.get(
    "/service",
    [authJwt.verifyToken, authJwt.isConsultant],
    consultantController.getConsultService
  );

  router.get(
    "/calling/:jobID",
    [authJwt.verifyToken, authJwt.isConsultant],
    consultantController.getCustomerDetail
  );

  router.post(
    "/advice",
    [authJwt.verifyToken, authJwt.isConsultant],
    consultantController.submitAdvice
  );

  app.use("/apis/consultant", router);
};
