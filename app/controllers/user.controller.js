const ApiError = require("../api-error");
const UserService = require("../services/user");
const MongoDB = require("../utils/mongodb.util");
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    if (!req.body?.email || !req.body?.password) {
        return next(new ApiError(400, "Email and password are required for registration"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.create(req.body);

        // Trả về thông tin người dùng sau khi đăng ký thành công
        return res.send({ user });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while registering the user"));
    }
};

exports.login = async (req, res, next) => {
    if (!req.body?.email || !req.body?.password) {
        return next(new ApiError(400, "Email and password are required for login"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.authenticate(req.body.email, req.body.password);

        if (!user) {
            return next(new ApiError(401, "Invalid email or password"));
        }

        // Tạo token và gửi về cho người dùng
        const token = jwt.sign({ userId: user._id, email: user.email, isAdmin: user.isAdmin }, 'your-secret-key', { expiresIn: '1h' });

        return res.send({ user, token });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while logging in"));
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findById(req.userId);

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        // Trả về thông tin người dùng (hoặc token, session, tùy thuộc vào cách bạn xây dựng hệ thống xác thực)
        return res.send({ user });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while retrieving user profile"));
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const users = await userService.findAll();

        // Trả về danh sách tất cả người dùng
        return res.send({ users });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while retrieving all users"));
    }
};

exports.updateUser = async (req, res, next) => {
    const userId = req.params.id;
    const updatedUserData = req.body;

    try {
        const userService = new UserService(MongoDB.client);
        const updatedUser = await userService.update(userId, updatedUserData);

        // Trả về thông tin người dùng sau khi cập nhật
        return res.send({ user: updatedUser });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, `Error updating user with id = ${userId}`));
    }
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const userService = new UserService(MongoDB.client);
        const deletedUser = await userService.delete(userId);

        // Trả về thông báo sau khi xóa người dùng
        return res.send({ message: "User was deleted successfully", deletedUser });
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, `Could not delete user with id = ${userId}`));
    }
};



