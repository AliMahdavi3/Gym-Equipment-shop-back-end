const { validationResult } = require('express-validator');
const Comment = require('../models/comment');


exports.getComments = async (req, res, next) => {
    try {
        const commentList = await Comment.find();
        res.status(200).json({
            message: 'Comments Fetched Successfully!',
            comments: commentList,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}


exports.createComment = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }


        const name = req.body.name;
        const email = req.body.email;
        const content = req.body.content;

        const comment = new Comment({
            name: name,
            email: email,
            content: content,
        });
        const commentResults = await comment.save();

        res.status(201).json({
            message: "Comment Created Successfully!",
            comment: commentResults,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.deleteComment = async (req, res, next) => {
    try {

        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            const error = new Error('Could Not Find Comment!');
            error.statusCode = 404;
            throw error;
        }


        const deletedComment = await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            message: 'Comment Deleted Successfully!',
            comment: deletedComment,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

