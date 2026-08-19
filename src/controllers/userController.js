// only test function to check if the middleware is working properly or not
const testAuth = (req, res) => {
    res.json({ 
        message: "Middleware is working perfectly!", 
        userRole: req.user.role // Token එකෙන් අරගත්තු Role එක පෙන්වයි
    });
};

module.exports = { testAuth };


