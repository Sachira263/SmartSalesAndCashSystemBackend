const jwt = require('jsonwebtoken');

// 1. Authentication: පරිශීලකයා එවන Token එක නිවැරදිදැයි පරීක්ෂා කිරීම (Security Guard)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

// 2. Authorization: පරිශීලකයාට අදාළ බලතල (Role) තියෙනවදැයි පරීක්ෂා කිරීම
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. You don't have permission to perform this action." });
        }
        next(); 
    };
};

module.exports = { verifyToken, checkRole };

