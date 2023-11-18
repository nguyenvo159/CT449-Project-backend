
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secret-key', (err, user) => {
        if (err) {
            console.error(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
