// authenticateToken.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed", err);
      return res.status(403).json({ message: "Token is invalid" });
    }
    req.user = { _id: decoded.id };
    next();
  });
}

module.exports = authenticateToken;
