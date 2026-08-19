const express = require('express');
const router = express.Router();

// Controllers සහ Middlewares මෙතැනට Import කරගැනීම
const { testAuth } = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// පරීක්ෂණ පාර (Test Route) - මෙතැනට එන්න පුළුවන් 'root' කෙනෙක්ට විතරයි
router.get('/test', verifyToken, checkRole(['Root']), testAuth);

module.exports = router;


