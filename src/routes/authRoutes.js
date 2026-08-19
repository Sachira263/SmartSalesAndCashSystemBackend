const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST /api/auth/login වෙත එන ඉල්ලීම් controller එකට යැවීම
router.post('/login', login);

module.exports = router;

