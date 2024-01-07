const { validationResult } = require('express-validator');
const EquippedGym = require('../models/equippedGym');
const path = require('path');

exports.getEquippedGyms = async (req, res, next) => {
    try {
        const equippedGymList = await EquippedGym.find();
        res.status(200).json({
            message: 'EquippedGyms Fetched Successfully!',
            equippedGyms: equippedGymList,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500; 
        }
        next(error)
    }
}

exports.createEquippedGym = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }

        if (!req.files || req.files.length === 0) {
            const error = new Error("Please upload at least one file");
            error.statusCode = 422;
            throw error;
        }

        const title = req.body.title;
        const content = req.body.content;
        const address = req.body.address;

        const equippedGym = new EquippedGym({
            title: title,
            content: content,
            address : address,
            imageUrl: req.files.map(file => file.path.replace(/\\/g, '/'))
        });
        const equippedGymResults = await equippedGym.save();

        res.status(201).json({
            message: "EquippedGym Created Successfully!",
            equippedGym: equippedGymResults,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getSingleEquippedGym = async (req, res, next) => {
    try {

        const equippedGymId = req.params.equippedGymId;
        const equippedGym = await EquippedGym.findById(equippedGymId);

        if (!equippedGym) {
            const error = new Error('EquippedGym Was Not Found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'EquippedGym was Found!',
            equippedGym: equippedGym
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


