require('dotenv').config();
const express=require("express");

const db = require('./config/db');


const app=express();
const PORT=5001;


// when server starts, test connect with database
db.query('SELECT NOW()')
  .then(() => console.log('Database Connected Successfully! ✅'))
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


