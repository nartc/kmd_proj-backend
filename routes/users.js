const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportJwt = require('passport-jwt');
const jwt = require('jsonwebtoken');

const config = require('../config/keys');
const User = require('../models/User');

//Add this to the route you want to protect: 'passport.authenticate('jwt', {session:false})'
//example: router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {});

//Register user
router.post('/register', (req, res) => {
    let newUser = new User({
        nickname: req.body.user.nickname,
        email: req.body.user.email,
        password: req.body.user.password
    });

    User.registerUser(newUser, (err, user) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error registering new User',
                error: err
            });
        }

        res.json({
            success: true,
            message: 'New User registered',
            user: user
        });
    });
});

//Login User
router.post('/login', (req, res) => {
    let email = req.body.creds.email;
    let password = req.body.creds.password;

    User.getUserByEmail(email, (err, user) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error getting User by email',
                error: err
            });
        }

        if(!user) {
            return res.json({
                success: false,
                message: `Email ${email} does not exist`
            });
        }

        User.comparePassword(password, user.password, (err, isMatched) => {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Error comparing password',
                    error: err
                });
            }

            if(!isMatched) {
                res.json({
                   success: false,
                   message: 'Password does not match' 
                });
            } else {
                jwt.sign({user: user}, config.secretKEY, {
                    expiresIn: 18000
                }, (err, token) => {
                    if(err) {
                        return res.json({
                            success: false,
                            message: 'Error authenticating',
                            error: err
                        });
                    }

                    res.json({
                        success: true,
                        message: 'Logged In',
                        authToken: `JWT ${token}`,
                        user: {
                            _id: user._id,
                            nickname: user.nickname,
                            email: user.email
                        }
                    });
                });
            }
        });
    });
});

module.exports = router;