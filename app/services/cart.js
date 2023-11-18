const { ObjectId } = require("mongodb");

class CartService {
    constructor(client) {
        this.Cart = client.db().collection("cart");
    }

    // Thêm  1 sản phẩm, nếu đã tồn tại thì update quantity
    async addItem(userId, productId, quantity) {
        const filter = {
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
            "items.productId": ObjectId.isValid(productId) ? new ObjectId(productId) : null,
        };

        const update = {
            $push: {
                items: {
                    productId: new ObjectId(productId),
                    quantity: parseInt(quantity),
                },
            },
        };

        const result = await this.Cart.findOneAndUpdate(
            filter,
            update,
            { returnDocument: "after", upsert: true }
        );

        return result.value;
    }


    async getCart(userId) {
        return await this.Cart.findOne({
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
        });
    }

    async updateItemQuantity(userId, productId, quantity) {
        const filter = {
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
            "items.productId": ObjectId.isValid(productId) ? new ObjectId(productId) : null,
        };

        const update = {
            $set: {
                "items.$.quantity": parseInt(quantity),
            },
        };

        const result = await this.Cart.findOneAndUpdate(filter, update, { returnDocument: "after" });

        return result.value;
    }

    async removeItem(userId, productId) {
        const filter = {
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
        };

        const update = {
            $pull: {
                items: {
                    productId: ObjectId.isValid(productId) ? new ObjectId(productId) : null,
                },
            },
        };

        const result = await this.Cart.findOneAndUpdate(filter, update, { returnDocument: "after" });

        return result.value;
    }

    async clearCart(userId) {
        const result = await this.Cart.findOneAndUpdate(
            { userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null },
            { $set: { items: [] } },
            { returnDocument: "after" }
        );

        return result.value;
    }
}

module.exports = CartService;
