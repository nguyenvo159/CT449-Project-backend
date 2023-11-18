const express = require("express");
const cart = require("../controllers/cart.controller");
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware để xác thực người dùng trước khi thực hiện các thao tác giỏ hàng
router.use(authenticateToken);

// Định nghĩa các route
router.route("/")
    .post(cart.addToCart)
    .get(cart.getCart)
    .put(cart.updateCartItem)
    .delete(cart.removeItemFromCart);
router.delete("/clear", cart.clearCart);

module.exports = router;
