const { validationResult } = require('express-validator');
const BestSelling = require('../models/bestSelling');
const path = require('path');
const fs = require('fs');

exports.getBestSellingProducts = async (req, res, next) => {
    try {
        const bestSellingList = await BestSelling.find();
        res.status(200).json({
            message: 'BestSelling Fetched Successfully!',
            bestSellings: bestSellingList,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500; 
        }
        next(error)
    }
}

exports.createBestSellingProduct = async (req, res, next) => {
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

        const bestSelling = new BestSelling({
            title: title,
            content: content,
            imageUrl: req.files.map(file => file.path.replace(/\\/g, '/'))
        });
        const bestSellingResults = await bestSelling.save();

        res.status(201).json({
            message: "bestSelling Created Successfully!",
            bestSelling: bestSellingResults,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getSingleBestSelling = async (req, res, next) => {
    try {

        const bestSellingId = req.params.bestSellingId;
        const bestSelling = await BestSelling.findById(bestSellingId);

        if (!bestSelling) {
            const error = new Error('BestSelling Was Not Found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'BestSelling was Found!',
            bestSelling: bestSelling
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.editBestSelling = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }

        const bestSellingId = req.params.bestSellingId;
        const title = req.body.title;
        const content = req.body.content;
        let imageUrl = req.body.images || [];

        if (req.files && req.files.length > 0) {
            imageUrl = req.files.map(file => file.path.replace(/\\/g, '/'));
        }

        if (!Array.isArray(imageUrl)) {
            const error = new Error('Invalid images data');
            error.statusCode = 422;
            throw error;
        }

        const bestSelling = await BestSelling.findById(bestSellingId);

        if (!bestSelling) {
            const error = new Error('Could Not Find BestSelling!');
            error.statusCode = 404;
            throw error;
        }

        if (imageUrl.length > 0 && imageUrl[0] !== bestSelling.imageUrl) {
            await clearImage(bestSelling.imageUrl);
        }

        bestSelling.title = title;
        bestSelling.content = content;
        bestSelling.imageUrl = imageUrl;

        await bestSelling.save();

        res.status(200).json({
            message: 'BestSelling Updated Successfully!',
            bestSelling: bestSelling,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}


exports.deleteBestSelling = async (req, res, next) => {
    try {

        const bestSellingId = req.params.bestSellingId;
        const bestSelling = await BestSelling.findById(bestSellingId);

        if (!bestSelling) {
            const error = new Error('Could Not Find BestSelling!');
            error.statusCode = 404;
            throw error;
        }


        await clearImage(bestSelling.imageUrl);
        const deletedBestSelling = await BestSelling.findByIdAndDelete(bestSellingId);

        res.status(200).json({
            message: 'BestSelling Deleted Successfully!',
            bestSelling: deletedBestSelling,
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
