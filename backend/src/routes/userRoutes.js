const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);

// PUT update role
router.put('/:userId/role', userController.updateUserRole);

// DELETE user
router.delete('/:userId', userController.deleteUser);

module.exports = router;
