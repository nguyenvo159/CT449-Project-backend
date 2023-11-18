const express = require("express");
const products = require("../controllers/product.controller");
//const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Endpoint quản lý sản phẩm
router.route("/")
    .get(products.findAll)
    //.post(authenticateToken, products.create)
    .post(products.create)
    //.delete(authenticateToken, products.deleteAll);
    .delete(products.deleteAll);

router.route("/shirts").get(products.findShirt);
router.route("/pants").get(products.findPant);

// Endpoint chi tiết sản phẩm
router.route("/:id")
    .get(products.findOne)
    //.put(authenticateToken, products.update)
    .put(products.update)
    //.delete(authenticateToken, products.delete);
    .delete(products.delete);

module.exports = router;
