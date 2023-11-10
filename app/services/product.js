const { ObjectId } = require("mongodb");

class ProductService {
    constructor(client) {
        this.Product = client.db().collection("product");
    }

    extractProductData(payload) {
        const product = {
            name: payload.name,
            price: payload.price,
            category: payload.category,
            imgURL: payload.imgURL,
            description: payload.description,
        };
        // Remove undefined fields
        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );
        return product;
    }

    // Tạo mới
    async create(payload) {
        const productData = this.extractProductData(payload);

        const result = await this.Product.findOneAndUpdate(
            productData,  // filter
            {
                $setOnInsert: {
                    ...productData,
                }
            },
            {
                returnDocument: "after",  // Trả về tài liệu sau khi chèn
                upsert: true  // Tự động chèn nếu tài liệu không tồn tại
            }
        );

        return result.value;
    }

    // Tìm 
    async find(filter) {
        const cursor = await this.Product.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findAll() {
        return await this.find({});
    }

    // Cập nhật
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = {
            $set: {
                name: payload.name,
                category: payload.category,
                price: payload.price,
                description: payload.description,
            },
        };

        const result = await this.Product.findOneAndUpdate(
            filter,
            update,
            { returnDocument: "after" }
        );

        return result.value;
    }

    // Xóa
    async delete(id) {
        const result = await this.Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        return result.value;
    }

    async deleteAll() {
        const result = await this.Product.deleteMany({});
        return result.deletedCount;
    }



}

module.exports = ProductService;
