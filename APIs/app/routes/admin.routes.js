module.exports = function (app) {
  var router = require("express").Router();
  const adminController = require("../controllers/admin.controller");
  const { authJwt } = require("../middlewares");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post(
    "/accept-consultant",
    [authJwt.verifyToken, authJwt.isAdmin],
    adminController.acceptConsultant
  );
  router.post(
    "/reject-consultant",
    [authJwt.verifyToken, authJwt.isAdmin],
    adminController.rejectConsultant
  );
  router.post(
    "/reject-phamarcy",
    [authJwt.verifyToken, authJwt.isAdmin],
    adminController.rejectPhamarcy
  );
  app.use("/apis/admin", router);
};
