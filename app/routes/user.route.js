const express = require("express");
// const authenticateToken = require('../middlewares/authMiddleware');
const user = require("../controllers/user.controller");
const router = express.Router();


router.post('/register', user.register);
router.post('/login', user.login);
router.get('/:id', user.getUserProfile);
router.get('/', user.getAllUsers);
router.put('/:id', user.updateUser);
router.delete('/:id', user.deleteUser);
router.post('/logout', user.logout);

module.exports = router;
