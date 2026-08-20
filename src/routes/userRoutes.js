const express = require('express');
const router = express.Router();
const { testAuth, createUser } = require('../controllers/userController');

// Controllers සහ Middlewares මෙතැනට Import කරගැනීම

const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// පරීක්ෂණ පාර (Test Route) - මෙතැනට එන්න පුළුවන් 'root' කෙනෙක්ට විතරයි
router.get('/test', verifyToken, checkRole(['Root']), testAuth);

//root use can create new user
router.post('/create', verifyToken, checkRole(['Root']), createUser);

module.exports = router;





