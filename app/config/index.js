const config = {
    app: {
        port: process.env.POORT || 3000,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fashion"
    }
};

module.exports = config;