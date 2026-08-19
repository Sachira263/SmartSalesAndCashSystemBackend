const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../config/db');

// Login Logic 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = userResult.rows[0];

        if (!user.is_active) {
            return res.status(403).json({ error: "Your account is disabled. Contact Admin." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET,           
            { expiresIn: '8h' }               
        );

        res.json({
            message: "Login successful",
            token: token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { login };


