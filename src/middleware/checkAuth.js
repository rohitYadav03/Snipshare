const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  try {
    const authCookie = req.cookies.login;

    if (!authCookie) {
      return res.status(401).json({ message: "No cookie found. Please login again." });
    }

    const validCookie = jwt.verify(authCookie, process.env.JWT_SECRET);

    req.user = validCookie;
    next();
  } catch (error) {
    res.status(401).json({ message: `Invalid or expired token: ${error.message}` });
  }
};

module.exports = { authenticateToken };
