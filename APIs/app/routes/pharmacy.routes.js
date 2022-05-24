module.exports = function (app) {
  var router = require("express").Router();
  const pharmacyController = require("../controllers/pharmacy.controller");
  const { authJwt } = require("../middlewares");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get(
    "/store-detail",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.getStoreDetail
  );

  router.get(
    "/products",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.getProducts
  );

  router.get(
    "/product/:productID",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.getSingleProduct
  );

  router.post(
    "/product",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.addProduct
  );

  router.put(
    "/product",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.editProduct
  );

  router.delete(
    "/product/:productID",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.deleteProduct
  );

  router.get(
    "/orders",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.getOrders
  );

  router.get(
    "/order/:orderID",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.getOrderDetail
  );

  router.post(
    "/order/confirm-delivery",
    [authJwt.verifyToken, authJwt.isPharmacy],
    pharmacyController.confirmSendOrder
  );

  app.use("/apis/pharmacy", router);
};
