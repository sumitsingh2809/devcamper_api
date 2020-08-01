const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');

const User = require('../models/User');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // else if(req.cookies.token) {
    //     // Set token from Cookie
    //     token = req.cookies.token
    // }

    // Make sure token exists
    if(!token) {
        return next(new ErrorResponse('Not Authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user) {
            return next(new ErrorResponse(`User Not Exist With Given Creds`, 404))
        }
        
        req.user = user;
        next();
    } catch (err) {
        return next(new ErrorResponse('Not Authorized to access this route', 401));
    }
})

// Grant Access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is unauthorized to access this roure`, 403));
        }
        next(); 
    }
}