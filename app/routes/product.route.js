const express = require("express");
const products = require("../controllers/product.controller");
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Endpoint quản lý sản phẩm
router.route("/")
    .get(products.findAll)
    .post(authenticateToken, products.create)
    .delete(authenticateToken, products.deleteAll);

// Endpoint chi tiết sản phẩm
router.route("/:id")
    .get(products.findOne)
    .put(authenticateToken, products.update)
    .delete(authenticateToken, products.delete);

module.exports = router;
