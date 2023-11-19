const express = require("express");
const products = require("../controllers/product.controller");
//const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Endpoint quản lý sản phẩm
router.route("/")
    .get(products.findAll)
    .post(products.create)
    .delete(products.deleteAll);

router.route("/shirts").get(products.findShirt);
router.route("/pants").get(products.findPant);

// Endpoint chi tiết sản phẩm
router.route("/:id")
    .get(products.findOne)
    .put(products.update)
    .delete(products.delete);

module.exports = router;
