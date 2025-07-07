const jwt = require('jsonwebtoken');
require('dotenv').config();  //Load .env variables
const JWT_SECRET = process.env.JWT_SECRET;
function isAuthenticated(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');
    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
}
module.exports = isAuthenticated ;
