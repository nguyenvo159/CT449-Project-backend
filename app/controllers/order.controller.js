const OrderService = require('../services/order');
const ApiError = require('../api-error');
const MongoDB = require("../utils/mongodb.util");

exports.createOrder = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const { userId, cart, address, name, phone, totalMoney } = req.body;
        const result = await orderService.createOrder(userId, cart, address, name, phone, totalMoney);
        res.json(result);
    } catch (error) {
        console.error(error);
        console.error("Error in createOrder:", error.message);
        next(new ApiError(500, 'An error occurred while creating the order'));
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const { userId, orderId } = req.params;
        const order = await orderService.getOrder(userId, orderId);
        res.json(order);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while getting the order'));
    }
};

exports.getUserOrders = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const { userId } = req.params;
        const orders = await orderService.getUserOrders(userId);
        res.json(orders);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while getting user orders'));
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while getting all orders'));
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const { userId, orderId } = req.params;
        const result = await orderService.deleteOrder(userId, orderId);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while deleting the order'));
    }
};

exports.deleteOrderById = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const { orderId } = req.params;
        const result = await orderService.deleteOrderById(orderId);
        res.json(result);
    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'An error occurred while deleting the order'));
    }
};
