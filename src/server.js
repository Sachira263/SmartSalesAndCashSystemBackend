require('dotenv').config();
const express=require("express");
const bcrypt = require("bcryptjs");// get new package for password hashing
const db = require('./config/db');

// Import the authRoutes   
const authRoutes = require('./routes/authRoutes');

const app=express();
const PORT=5001;

app.use(express.json());// Middleware to parse JSON request bodies

app.use('/api/auth', authRoutes);// Use the authRoutes for authentication-related endpoints

// process of create root user automatically when server starts
async function createRootUser() {
    try {
        // 1. Check if a Root User already exists in the database
        const checkUser = await db.query("SELECT * FROM users WHERE role = 'Root'");

        // 2. If no Root User exists, create one
        if (checkUser.rows.length === 0) {
            // Hash the temporary password (Admin@123)

            const hashedPassword = await bcrypt.hash('Admin@123', 10); 

            const insertQuery = `
                INSERT INTO users (name, email, password_hash, role, is_active)
                VALUES ($1, $2, $3, $4, $5)
            `;
            const values = ['Super Admin', 'admin@smartsales.com', hashedPassword, 'Root', true];

            await db.query(insertQuery, values);
            console.log('Root User created successfully! ');
        } else {
            console.log('Root User already exists. ');
        }
    } catch (err) {
        console.error('Error creating root user ', err.message);
    }
}




// when server starts, test connect with database
db.query('SELECT NOW()')
  .then(() => {
     console.log('Database Connected Successfully! ✅');
      createRootUser(); // Call the function to create the root user
  })
  .catch(err => console.error('Database Connection Error ❌', err.stack));


app.get('/api/test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: "Connected successfully!", time: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Database connection error");
  }
});

const server=app.listen(PORT, ()=>{

     console.log(`server is running on port ${PORT}`);
})


