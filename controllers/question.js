const { validationResult } = require('express-validator');
const Question = require('../models/question');


exports.getQuestions = async (req, res, next) => {
    try {
        const questionList = await Question.find();
        res.status(200).json({
            message: 'Questions Fetched Successfully!',
            questions: questionList,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}


exports.createQuestion = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }


        const title = req.body.title;
        const content = req.body.content;

        const question = new Question({
            title: title,
            content: content,
        });
        const questionResults = await question.save();

        res.status(201).json({
            message: "Question Created Successfully!",
            question: questionResults,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



exports.getSingleQuestion = async (req, res, next) => {
    try {

        const questionId = req.params.questionId;
        const question = await Question.findById(questionId);

        if (!question) {
            const error = new Error('Question Was Not Found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Question was Found!',
            question: question
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


exports.editQuestion = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }

        const questionId = req.params.questionId;
        const title = req.body.title;
        const content = req.body.content;


        const question = await Question.findById(questionId);

        if (!question) {
            const error = new Error('Could Not Find Question!');
            error.statusCode = 404;
            throw error;
        }


        question.title = title;
        question.content = content;

        await question.save();

        res.status(200).json({
            message: 'Question Updated Successfully!',
            question: question,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}


exports.deleteQuestion = async (req, res, next) => {
    try {

        const questionId = req.params.questionId;
        const question = await Question.findById(questionId);

        if (!question) {
            const error = new Error('Could Not Find Question!');
            error.statusCode = 404;
            throw error;
        }


        const deletedQuestion = await Question.findByIdAndDelete(questionId);

        res.status(200).json({
            message: 'Question Deleted Successfully!',
            question: deletedQuestion,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

