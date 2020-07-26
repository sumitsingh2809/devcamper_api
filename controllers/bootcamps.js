'use strict';

const path = require('path');

const Bootcamp = require('../models/Bootcamp');

const geocoder = require('../utils/geocoder');
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
    res.status(200).json(res.advancedResults);
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
    // Add user to body
    req.body.user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // if the user is not an admin, they can only add one bootcamp
    if(publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }

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
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    bootcamp.remove(); // Triggers bootcamp pre delete middleware

    res.status(200).json({ success: true, data: {} });
});

/**
 * @description  Get Bootcamps Within a radius
 * @route        GET  /api/v1/bootcamps/radius/:zipcode/:distance
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calc radius using radians
    // divide distance by radius of earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

/**
 * @description  Upload photo for Bootcamp
 * @route        PUT  /api/v1/bootcamps/:id/photo
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`please upload a file`, 400));
    }

    const file = req.files.file;

    // Make Sure that image is photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`please upload an image file`, 400));
    }

    // Check File Size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Create Custom Filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload.`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});
