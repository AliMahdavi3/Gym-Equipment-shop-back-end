const { validationResult } = require('express-validator');
const Article = require('../models/article');
const path = require('path');
const fs = require('fs');


exports.getArticles = async (req, res, next) => {
    try {
        const articleList = await Article.find();
        res.status(200).json({
            message: 'Articles Founded Successfully!',
            articles: articleList
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.createArticle = async (req, res, next) => {
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
        const value = req.body.value;
        const author = req.body.author;


        const article = new Article({
            title: title,
            value: value,
            imageUrl: req.files.map(file => file.path.replace(/\\/g, '/')),
            author: author,
        });
        const articleResults = await article.save();

        res.status(201).json({
            message: "Article Created Successfully!",
            article: articleResults,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.getSingleArticle = async (req, res, next) => {
    try {
        const articleId = req.params.articleId;
        const article = await Article.findById(articleId);

        if (!article) {
            const error = new Error('Article Was Not Found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Article was Found!',
            article: article
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.editArticle = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }

        const articleId = req.params.articleId;
        const title = req.body.title;
        const value = req.body.value;
        const author = req.body.author;
        let imageUrl = req.body.images || [];

        if (req.files && req.files.length > 0) {
            imageUrl = req.files.map(file => file.path.replace(/\\/g, '/'));
        }

        if (!Array.isArray(imageUrl)) {
            const error = new Error('Invalid images data');
            error.statusCode = 422;
            throw error;
        }

        const article = await Article.findById(articleId);

        if (!article) {
            const error = new Error('Could Not Find Article!');
            error.statusCode = 404;
            throw error;
        }

        if (imageUrl.length > 0 && imageUrl[0] !== article.imageUrl) {
            await clearImage(article.imageUrl);
        }

        article.title = title;
        article.value = value;
        article.author = author;
        article.imageUrl = imageUrl;

        await article.save();

        res.status(200).json({
            message: 'Article Updated Successfully!',
            article: article,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}


exports.deleteArticle = async (req, res, next) => {
    try {

        const articleId = req.params.articleId;
        const article = await Article.findById(articleId);

        if (!article) {
            const error = new Error('Could Not Find Article!');
            error.statusCode = 404;
            throw error;
        }


        await clearImage(article.imageUrl);
        const deletedArticle = await Article.findByIdAndDelete(articleId);

        res.status(200).json({
            message: 'Article Deleted Successfully!',
            article: deletedArticle,
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
