const { validationResult } = require('express-validator');
const SendMessage = require('../models/sendMessage');


exports.getMessages = async (req, res, next) => {
    try {
        const messageList = await SendMessage.find();
        res.status(200).json({
            message: 'Messages Fetched Successfully!',
            sendMessages: messageList,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}


exports.createMessage = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation Faild!, Your Entered Data is Invalid');
            error.statusCode = 422;
            throw error;
        }


        const name = req.body.name;
        const content = req.body.content;
        const phoneNumber = req.body.phoneNumber;

        const sendMessage = new SendMessage({
            name: name,
            phoneNumber: phoneNumber,
            content: content,
        });
        const messageResults = await sendMessage.save();

        res.status(201).json({
            message: "Message Created Successfully!",
            sendMessage: messageResults,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



exports.getSingleMessage = async (req, res, next) => {
    try {

        const messageId = req.params.messageId;
        const sendMessage = await SendMessage.findById(messageId);

        if (!sendMessage) {
            const error = new Error('SendMessage Was Not Found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'SendMessage was Found!',
            sendMessage: sendMessage
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



exports.deleteMessage = async (req, res, next) => {
    try {

        const messageId = req.params.messageId;
        const sendMessage = await SendMessage.findById(messageId);

        if (!sendMessage) {
            const error = new Error('Could Not Find Message!');
            error.statusCode = 404;
            throw error;
        }


        const deletedMessage = await SendMessage.findByIdAndDelete(messageId);

        res.status(200).json({
            message: 'Message Deleted Successfully!',
            sendMessage: deletedMessage,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

