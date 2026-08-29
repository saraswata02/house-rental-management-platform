const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // No Authorization header or not a Bearer token
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const landlordOnly = (req, res, next) => {
    if (req.user && req.user.role === 'landlord') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Landlords only' });
    }
};

const tenantOnly = (req, res, next) => {
    if (req.user && req.user.role === 'tenant') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Tenants only' });
    }
};

module.exports = { protect, landlordOnly, tenantOnly };
