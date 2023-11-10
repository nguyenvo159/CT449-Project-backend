const express = require("express");
const authenticateToken = require('../middlewares/authMiddleware');
const user = require("../controllers/user.controller");
const router = express.Router();


router.post('/register', user.register);
router.post('/login', user.login);
router.get('/profile', authenticateToken, user.getUserProfile);
router.get('/all', authenticateToken, user.getAllUsers);
router.put('/:id', authenticateToken, user.updateUser);
router.delete('/:id', authenticateToken, user.deleteUser);

module.exports = router;
