'use strict';

const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @description  Get Courses
 * @route        GET /api/v1/courses
 * @route        GET /api/v1/bootcamps/:bootcampId/courses
 * @access       Public
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

/**
 * @description  Get Single Course
 * @route        GET /api/v1/courses/:id
 * @access       Public
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

/**
 * @description  Add Course
 * @route        POST /api/v1/bootcamps/:bootcampId/courses
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});

/**
 * @description  Update Course
 * @route        PUT /api/v1/courses/:id
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.id}`, 404));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

/**
 * @description  Delete Course
 * @route        DELETE /api/v1/courses/:id
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.id}`, 404));
    }

    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
