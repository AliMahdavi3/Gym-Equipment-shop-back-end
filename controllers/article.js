const { validationResult } = require('express-validator');
const Article = require('../models/article');
const path = require('path');


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

        const title_1 = req.body.title_1;
        const title_2 = req.body.title_2;
        const content_1 = req.body.content_1;
        const content_2 = req.body.content_2;
        const author = req.body.author;


        const article = new Article({
            title_1: title_1,
            title_2: title_2,
            content_1: content_1,
            content_2: content_2,
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