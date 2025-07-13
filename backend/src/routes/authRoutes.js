const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json(req.user);
});

module.exports = router;
