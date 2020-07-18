const User = require('../models/User');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @description  Register User
 * @route        GET /api/v1/auth/register
 * @access       Public
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    res.status(200).json({ success: true });
});
