const { validationResult } = require('express-validator');
const BestSelling = require('../models/bestSelling');
const path = require('path');

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

