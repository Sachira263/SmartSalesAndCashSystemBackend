const express = require('express');
const router = express.Router();
const { testAuth, createUser,deleteUser,getAllUsers,updateUser } = require('../controllers/userController');

// Controllers සහ Middlewares මෙතැනට Import කරගැනීම

const { verifyToken, checkRole } = require('../middlewares/authMiddleware');


// පරීක්ෂණ පාර (Test Route) - මෙතැනට එන්න පුළුවන් 'root' සහ 'admin' කෙනෙක්ට විතරයි
router.get('/test', verifyToken, checkRole(['Root','Admin']), testAuth);

//root and admin users can create new user
router.post('/create', verifyToken, checkRole(['Root','Admin']), createUser);

//root use can delete user
router.delete('/delete/:id', verifyToken, checkRole(['Root','Admin']), deleteUser);

//root and admin users can update user
router.put('/update/:id', verifyToken, checkRole(['Root','Admin']), updateUser);

//root use can get all users
router.get('/all', verifyToken, checkRole(['Root','Admin']), getAllUsers);

module.exports = router;














