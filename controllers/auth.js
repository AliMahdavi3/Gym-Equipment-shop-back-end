const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(422).json({
                message: 'Validation faild, your entered data is invalid!',
                errors: errors.array(),
            });
        }

        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            name: name,
            password: hashedPassword,
        });
        const result = user.save();

        return res.status(201).json({
            message: 'User created Successfully!',
            userId: result._id,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.login = async (req, res, next) => {
    
    try {
        
        const email = req.body.email;
        const password = req.body.password;
        
        const user = await User.findOne({email: email});
    
        if(!user) {
            const error = new Error('User with this email not found!');
            error.statusCode = 401;
            throw error;
        }
    
        const isEqual = await bcrypt.compare(password, user.password);
    
        if(!isEqual) {
            const error = new Error('Wrong Password!');
            error.statusCode = 401;
            throw error;
        }
    
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, 'alimahdavi', {
            expiresIn: '365d'
        });
    
    
        res.status(200).json({
            message: 'Login Was successfully!',
            token: token,
            userId: user._id.toString()
        });
        
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || 'Internal Server Error!'
        });
    }
    
}