const CartService = require('../services/cart');
const ApiError = require('../api-error');
const MongoDB = require("../utils/mongodb.util");

// const cartService = new CartService(MongoDB.client);

exports.addToCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const { userId, productId, quantity } = req.body;
        const result = await cartService.addToCart(userId, productId, quantity);
        res.json(result);
    } catch (error) {
        console.error(error);
        // Thêm dòng dưới để in ra chi tiết lỗi
        console.error("Error in addToCart:", error.message);
        next(new ApiError(500, 'An error occurred while adding to the cart'));
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const { userId } = req.params;
        const cart = await cartService.getCart(userId);
        res.json(cart);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while getting the cart'));
    }
};

exports.updateQuantity = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const { userId, productId, quantity } = req.body;
        const result = await cartService.updateQuantity(userId, productId, quantity);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while updating quantity in the cart'));
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const { userId } = req.params;
        const result = await cartService.clearCart(userId);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while clearing the cart'));
    }
};

exports.removeItem = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const { userId, productId } = req.params;
        const result = await cartService.removeItem(userId, productId);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while removing item from the cart'));
    }
};
