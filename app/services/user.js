
const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("user");
    }

    extractUserData(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            isAdmin: payload.isAdmin || false,

        };
        // Remove undefined fields
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async create(payload) {
        const userData = this.extractUserData(payload);

        const result = await this.User.findOneAndUpdate(
            { email: userData.email },  // filter bằng email
            {
                $setOnInsert: {
                    ...userData,
                }
            },
            {
                returnDocument: "after",  // Trả về tài liệu sau khi chèn
                upsert: true  // Tự động chèn nếu tài liệu không tồn tại
            }
        );

        return result.value;
    }

    //Tìm bằng email
    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.User.findOne({
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
                email: payload.email,
                password: payload.password,
                isAdmin: payload.isAdmin || false,
            },
        };

        const result = await this.User.findOneAndUpdate(
            filter,
            update,
            { returnDocument: "after" }
        );

        return result.value;
    }

    // Xóa 
    async delete(id) {
        const result = await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });

        return result.value;
    }




    async authenticate(email, password) {
        const user = await this.User.findOne({ email: email });

        if (!user || user.password !== password) {
            // Thông tin đăng nhập không hợp lệ
            return null;
        }

        // Xác thực thành công, trả về thông tin người dùng (hoặc token, session, tùy thuộc vào cách bạn xây dựng hệ thống xác thực)
        return user;
    }
    async logout(userId, token) {
        await this.User.updateOne(
            { _id: ObjectId(userId) },
            { $pull: { tokens: token } }
        );
    }

}

module.exports = UserService;
