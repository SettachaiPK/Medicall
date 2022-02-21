module.exports = function (app) {
    var router = require("express").Router();
    const externalController = require("../controllers/external.controller");
    const { authJwt } = require("../middlewares");
  
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    router.post("/confirm-payment", externalController.confirmPayment);
  
    app.use("/apis/external", router);
  };
  