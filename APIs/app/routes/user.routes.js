module.exports = function (app) {
  var router = require("express").Router();
  const userController = require("../controllers/user.controller");
  const { authJwt } = require("../middlewares");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/avatar", [authJwt.verifyToken], userController.editAvatar);

  app.use("/apis/user", router);
};
