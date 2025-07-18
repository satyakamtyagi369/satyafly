const jwt = require('jsonwebtoken');
require('dotenv').config();  // is files se mera jwt token verify ho rah hai. 
const JWT_SECRET = process.env.JWT_SECRET;
// is file me hum JWT token ko verify karenge
// agar token valid hai toh user ko dashboard page pe redirect karenge
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
