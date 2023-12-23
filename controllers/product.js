const { validationResult } = require('express-validator');
const Product = require('../models/product');
const path = require('path');

exports.getProducts = async (req, res, next) => {
    try {
        const productsList = await Product.find();
        res.status(200).json({
            message: 'Products Fetched Successfully!',
            products: productsList,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500; 
        }
        next(error)
    }
}

exports.createProduct = async (req, res, next) => {
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

        const product = new Product({
            title: title,
            content: content,
            imageUrl: req.files.map(file => file.path.replace(/\\/g, '/'))
        });
        const productResults = await product.save();

        res.status(201).json({
            message: "Product Created Successfully!",
            product: productResults,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getSingleProduct = async (req, res, next) => {
    try {

        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            const error = new Error('Product Was Not Found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Product was Found!',
            product: product
        });

    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}