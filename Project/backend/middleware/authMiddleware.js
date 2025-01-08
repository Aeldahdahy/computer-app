const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('./tokenBlacklist');

dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    if (isBlacklisted(token)) {
        return res.status(401).json({ message: 'Token has been terminated.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Check for specific error types
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        }
        return res.status(500).json({ message: 'Server error.' }); // Handle any other errors
    }
};

module.exports = authMiddleware;