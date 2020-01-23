'use strict';

const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @description  Get All Bootcamps
 * @route        GET /api/v1/bootcamps
 * @access       Public
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @description  Get Single Bootcamp
 * @route        GET /api/v1/bootcamps/:id
 * @access       Public
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description  Create New Bootcamp
 * @route        POST /api/v1/bootcamps
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

/**
 * @description  Update Bootcamp
 * @route        PUT /api/v1/bootcamps/:id
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description  Delete Bootcamp
 * @route        DELETE  /api/v1/bootcamps/:id
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: {} });
});
