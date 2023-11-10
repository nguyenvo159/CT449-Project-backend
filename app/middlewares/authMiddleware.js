
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            console.error(err);
            return res.sendStatus(403);
        }
        req.userId = user.userId;
        next();
    });
};

module.exports = authenticateToken;
