const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const router = express.Router();
const authController = require('../controllers/auth');


router.post('/register', [
    body('email').isEmail(),
    body('password').trim().isLength({min:5}),
    body('name').trim().isLength({min:5}).notEmpty(),
], authController.register);


router.post('/login', authController.login);

module.exports = router;