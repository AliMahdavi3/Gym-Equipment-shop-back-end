const { validationResult } = require('express-validator');
const Product = require('../models/product');
const path = require('path');
const fs = require('fs');

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
        const productCode = req.body.productCode;
        const category = req.body.category;

        const product = new Product({
            title: title,
            content: content,
            productCode: productCode,
            category: category,
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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.editProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }

        const productId = req.params.productId;
        const title = req.body.title;
        const content = req.body.content;
        const productCode = req.body.productCode;
        const category = req.body.category;
        let imageUrl = req.body.images || [];

        if (req.files && req.files.length > 0) {
            imageUrl = req.files.map(file => file.path.replace(/\\/g, '/'));
        }

        if (!Array.isArray(imageUrl)) {
            const error = new Error('Invalid images data');
            error.statusCode = 422;
            throw error;
        }

        const product = await Product.findById(productId);

        if (!product) {
            const error = new Error('Could Not Find Product!');
            error.statusCode = 404;
            throw error;
        }

        if (imageUrl.length > 0 && imageUrl[0] !== product.imageUrl) {
            await clearImage(product.imageUrl);
        }

        product.title = title;
        product.content = content;
        product.productCode = productCode;
        product.category = category;
        product.imageUrl = imageUrl;

        await product.save();

        res.status(200).json({
            message: 'Product Updated Successfully!',
            product: product,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}


exports.deleteProduct = async (req, res, next) => {
    try {

        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            const error = new Error('Could Not Find Product!');
            error.statusCode = 404;
            throw error;
        }


        await clearImage(product.imageUrl);
        const deletedProduct = await Product.findByIdAndDelete(productId);

        res.status(200).json({
            message: 'Product Deleted Successfully!',
            product: deletedProduct,
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

