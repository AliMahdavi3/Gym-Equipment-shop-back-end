const { validationResult } = require('express-validator');
const EquippedGym = require('../models/equippedGym');
const path = require('path');
const fs = require('fs');

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


exports.editEquippedGym = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }

        const equippedGymId = req.params.equippedGymId;
        const title = req.body.title;
        const content = req.body.content;
        const address = req.body.address;
        let imageUrl = req.body.images || [];

        if (req.files && req.files.length > 0) {
            imageUrl = req.files.map(file => file.path.replace(/\\/g, '/'));
        }

        if (!Array.isArray(imageUrl)) {
            const error = new Error('Invalid images data');
            error.statusCode = 422;
            throw error;
        }

        const equippedGym = await EquippedGym.findById(equippedGymId);

        if (!equippedGym) {
            const error = new Error('Could Not Find EquippedGym!');
            error.statusCode = 404;
            throw error;
        }

        if (imageUrl.length > 0 && imageUrl[0] !== equippedGym.imageUrl) {
            await clearImage(equippedGym.imageUrl);
        }

        equippedGym.title = title;
        equippedGym.content = content;
        equippedGym.address = address;
        equippedGym.imageUrl = imageUrl;

        await equippedGym.save();

        res.status(200).json({
            message: 'EquippedGym Updated Successfully!',
            equippedGym: equippedGym,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}


exports.deleteEquippedGym = async (req, res, next) => {
    try {

        const equippedGymId = req.params.equippedGymId;
        const equippedGym = await EquippedGym.findById(equippedGymId);

        if (!equippedGym) {
            const error = new Error('Could Not Find EquippedGym!');
            error.statusCode = 404;
            throw error;
        }


        await clearImage(equippedGym.imageUrl);
        const deletedEquippedGym = await EquippedGym.findByIdAndDelete(equippedGymId);

        res.status(200).json({
            message: 'EquippedGym Deleted Successfully!',
            equippedGym: deletedEquippedGym,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


const clearImage = async (filePaths) => {
    console.log(filePaths);
    if (Array.isArray(filePaths)) {
        filePaths.forEach((filePath) => {
            const pathToFile = path.join(__dirname, '..', filePath);
            console.log('Checking file:', pathToFile);
            if (fs.existsSync(pathToFile)) {
                try {
                    fs.unlinkSync(pathToFile);
                    console.log('Image Deleted Successfully!');
                } catch (error) {
                    console.log('Failed to delete image:', error);
                }
            } else {
                console.log('Image Not Found:', pathToFile);
            }
        });
    } else {
        const pathToFile = path.join(__dirname, '..', filePaths);
        console.log('Checking file:', pathToFile);
        if (fs.existsSync(pathToFile)) {
            try {
                fs.unlinkSync(pathToFile);
                console.log('Image Deleted Successfully!');
            } catch (error) {
                console.log('Failed to delete image:', error);
            }
        } else {
            console.log('Image Not Found:', pathToFile);
        }
    }
};
