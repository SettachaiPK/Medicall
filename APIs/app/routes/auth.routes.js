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
  router.post("/signin", authController.signin);

  router.get("/signout", authController.detete_cookie);

  router.get("/testAPI/:val1", authController.testAPI);
  router.get("/testAPI2/:val1", authController.testAPI2);

  app.use("/apis/auth", router);
};
