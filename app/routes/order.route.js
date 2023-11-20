const express = require('express');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router.post('/createOrder', orderController.createOrder);
router.get('/getOrder/:userId/:orderId', orderController.getOrder);
router.get('/getUserOrders/:userId', orderController.getUserOrders);
router.get('/getAllOrders', orderController.getAllOrders);
router.delete('/deleteOrder/:userId/:orderId', orderController.deleteOrder);
module.exports = router;