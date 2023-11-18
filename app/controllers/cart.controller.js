const ApiError = require("../api-error");
const CartService = require("../services/cart");
const MongoDB = require("../utils/mongodb.util");


exports.addToCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const { productId, quantity } = req.body;
        const userId = req.userId;

        const cart = await cartService.addItem(userId, productId, quantity);

        return res.send({ cart });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while adding to the cart"));
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const userId = req.userId;

        const cart = await cartService.getCart(userId);

        return res.send({ cart });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while retrieving the cart"));
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const { productId, quantity } = req.body;
        const userId = req.userId;

        const cart = await cartService.updateItemQuantity(userId, productId, quantity);

        return res.send({ cart });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while updating the cart item"));
    }
};

exports.removeItemFromCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const { productId } = req.body;
        const userId = req.userId;

        const cart = await cartService.removeItem(userId, productId);

        return res.send({ cart });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while removing from the cart"));
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const userId = req.userId;

        const cart = await cartService.clearCart(userId);

        return res.send({ cart });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while clearing the cart"));
    }
};
