const express = require("express");
const authenticateToken = require('../middlewares/authMiddleware');
const user = require("../controllers/user.controller");
const router = express.Router();


router.post('/register', user.register);
router.post('/login', user.login);
router.get('/:id', authenticateToken, user.getUserProfile);
router.get('/', authenticateToken, user.getAllUsers);
router.put('/:id', authenticateToken, user.updateUser);
router.delete('/:id', authenticateToken, user.deleteUser);
router.post('/logout', authenticateToken, user.logout);

module.exports = router;
