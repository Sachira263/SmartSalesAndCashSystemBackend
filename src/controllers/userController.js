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


// 3. Delete User Controller (Soft Delete)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Postman එකෙන් ID එක එවනවා

        // යූසර් ඉන්නවද කියලා බලමු
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        // ඩේටාබේස් එකේ is_active එක false කරන්න
        await pool.query('UPDATE users SET is_active = FALSE WHERE id = $1', [id]);

        res.status(200).json({ message: "User deactivated successfully!" });

    } catch (error) {
        console.error("Error in deleteUser:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};

 
// 4.Get All Users Controller

const getAllUsers = async (req, res) => {
    try {
        // ඩේටාබේස් එකෙන් සියලුම යූසර්ලා ලබා ගැනීම (password_hash හැර අනෙක් සියල්ල)
        const users = await pool.query(
            'SELECT id, name, email, phone_number, role, is_active, created_at FROM users ORDER BY created_at DESC'
        );

        res.status(200).json({
            success: true,
            count: users.rows.length,
            users: users.rows
        });

    } catch (error) {
        console.error("Error in getAllUsers:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};


// 5. Update User Controller
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // URL එකෙන් ගන්න User ID එක
        const { name, phone_number, role, is_active } = req.body; // වෙනස් කරන්න අවශ්‍ය දත්ත

        // 1. මේ ID එක තියෙන යූසර් කෙනෙක් ඩේටාබේස් එකේ ඉන්නවද කියලා බලමු
        const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (checkUser.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. ඩේටාබේස් එක යාවත්කාලීන කිරීම (Update Query)
        // (අපි දෙන අලුත් අගයන් දාලා, නැතිනම් කලින් තිබුණු අගයන්ම තියාගන්න Coalesce පාවිච්චි කරන්නත් පුළුවන්, 
        // හැබැයි මෙතැනදී සරලව නම, ෆෝන් නම්බර්, රෝල් සහ ස්ටේටස් වෙනස් වන ලෙස ලියමු)
        const updatedUser = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 phone_number = COALESCE($2, phone_number), 
                 role = COALESCE($3, role), 
                 is_active = COALESCE($4, is_active),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 
             RETURNING id, name, email, phone_number, role, is_active, updated_at`,
            [name, phone_number, role, is_active, id]
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser.rows[0]
        });

    } catch (error) {
        console.error("Error in updateUser:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};




module.exports = {
    testAuth,
    createUser,
    deleteUser,
    getAllUsers,
    updateUser
};





