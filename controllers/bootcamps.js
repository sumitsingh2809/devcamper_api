'use strict';

const Bootcamp = require('../models/Bootcamp');

/**
 * @description  Get All Bootcamps
 * @route        GET /api/v1/bootcamps
 * @access       Public
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

/**
 * @description  Get Single Bootcamp
 * @route        GET /api/v1/bootcamps/:id
 * @access       Public
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

/**
 * @description  Create New Bootcamp
 * @route        POST /api/v1/bootcamps
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

/**
 * @description  Update Bootcamp
 * @route        PUT /api/v1/bootcamps/:id
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

/**
 * @description  Delete Bootcamp
 * @route        DELETE  /api/v1/bootcamps/:id
 * @access       Private
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
