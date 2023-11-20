const { ObjectId } = require("mongodb");
const _ = require('lodash');

class OrderService {
    constructor(client) {
        this.Order = client.db().collection("order");
        this.client = client;
    }

    async createOrder(userId, cart, address, name, phone, totalMoney) {
        if (!ObjectId.isValid(userId)) {
            throw new Error("Invalid userId");
        }

        const order = {
            userId: new ObjectId(userId),
            cart: _.cloneDeep(cart),
            orderDate: new Date(),
            address: address,
            name: name,
            phone: phone,
            totalMoney: totalMoney,
            // Các thông tin khác về đơn hàng có thể được thêm vào ở đây
        };

        const result = await this.Order.insertOne(order);
        return result && result.ops ? result.ops[0] : null;
    }

    async getOrder(userId, orderId) {
        const filter = {
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
            _id: ObjectId.isValid(orderId) ? new ObjectId(orderId) : null
        };

        const order = await this.Order.findOne(filter);
        return order;
    }

    async getUserOrders(userId) {
        const filter = { userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null };
        const orders = await this.Order.find(filter).toArray();
        return orders;
    }

    async getAllOrders() {
        const orders = await this.Order.find({}).toArray();
        return orders;
    }

    async deleteOrder(userId, orderId) {
        const filter = {
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
            _id: ObjectId.isValid(orderId) ? new ObjectId(orderId) : null
        };

        const result = await this.Order.findOneAndDelete(filter);
        return result.value;
    }
}

module.exports = OrderService;
