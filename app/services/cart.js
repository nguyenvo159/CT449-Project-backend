const { ObjectId } = require("mongodb");

const ProductService = require("./product");

class CartService {
    constructor(client) {
        this.Cart = client.db().collection("cart");
        this.productService = new ProductService(client);
        this.client = client;
    }

    async addToCart(userId, productId, quantity = 1) {
        if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
            throw new Error("Invalid userId or productId");
        }

        const filter = { userId: new ObjectId(userId), "items.productId": new ObjectId(productId) };

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingCartItem = await this.Cart.findOne(filter);

        if (existingCartItem) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            const updatedQuantity = existingCartItem.items.find(item => item.productId.equals(new ObjectId(productId))).quantity + quantity;

            const update = {
                $set: { "items.$.quantity": updatedQuantity }
            };

            const result = await this.Cart.findOneAndUpdate(filter, update, { returnDocument: "after" });

            return result.value;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
            const update = {
                $addToSet: {
                    items: {
                        productId: new ObjectId(productId),
                        quantity: quantity
                    }
                }
            };

            const result = await this.Cart.findOneAndUpdate(filter, update, { upsert: true, returnDocument: "after" });

            return result.value;
        }
    }

    async getCart(userId) {
        const filter = { userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null };
        const cart = await this.Cart.findOne(filter);

        if (cart) {

            const populatedCart = await this.populateCart(cart);
            return populatedCart;
        }

        return null;
    }

    async populateCart(cart) {
        const productIds = cart.items.map(item => item.productId);

        const products = await this.productService.find({ _id: { $in: productIds } });

        const populatedCart = {
            ...cart,
            items: cart.items.map(item => ({
                ...item,
                product: products.find(product => product._id.toString() === item.productId.toString())
            }))
        };

        return populatedCart;
    }

    async updateQuantity(userId, productId, quantity) {
        const filter = {
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
            "items.productId": ObjectId.isValid(productId) ? new ObjectId(productId) : null
        };

        const update = {
            $set: { "items.$.quantity": quantity }
        };

        const result = await this.Cart.findOneAndUpdate(
            filter,
            update,
            { returnDocument: "after" }
        );

        return result.value;
    }

    async clearCart(userId) {
        const filter = { userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null };

        const result = await this.Cart.findOneAndDelete(filter);

        return result.value;
    }
    async removeItem(userId, productId) {
        const filter = {
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
        };

        const update = {
            $pull: { items: { productId: ObjectId.isValid(productId) ? new ObjectId(productId) : null } }
        };

        const result = await this.Cart.findOneAndUpdate(
            filter,
            update,
            { returnDocument: "after" }
        );

        return result.value;
    }
}

module.exports = CartService;
