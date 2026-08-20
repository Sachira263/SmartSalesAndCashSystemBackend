const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Database connection pool

// 1. Test Auth Controller (Created at 2026/8/19)
const testAuth = (req, res) => {
    res.status(200).json({
        message: "Middleware is working perfectly!",
        userRole: req.user.role
    });
};

// 2. Create User Controller (Created at 2026/8/20)
const createUser = async (req, res) => {
    try {
        const { name, email, password, phone_number, role } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Please provide all required fields." });
        }

        // Check if user with this email already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User with this email already exists." });
        }

        // Hash the password (for security)
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email,phone_number, role',
            [name, email, password_hash, phone_number, role]
        );

        res.status(201).json({
            message: "User created successfully!",
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error("Error in createUser:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = {
    testAuth,
    createUser
};


