const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const util = require('util');

const config = require('../config/keys');
const User = require('../models/User');

//Add this to the route you want to protect: 'passport.authenticate('jwt', {session:false})'
//example: router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {});

//Register user
router.post('/register', (req, res) => {
    console.log(req.body);
    let newUser = new User({
        nickname: req.body.user.nickname,
        email: req.body.user.email,
        password: req.body.user.password
    });

    User.registerUser(newUser, (err, user) => {
        if(err) {
            return res.json({
                success: false,
                title: 'Error',
                message: 'Error registering new User',
                error: err
            });
        }

        res.json({
            success: true,
            title: 'Success',
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
                title: 'Error',
                message: 'Error getting User by email',
                error: err
            });
        }

        if(!user) {
            return res.json({
                success: false,
                title: 'Error',
                message: `Email ${email} does not exist`
            });
        }

        User.comparePassword(password, user.password, (err, isMatched) => {
            if(err) {
                return res.json({
                    success: false,
                    title: 'Error',
                    message: 'Error comparing password',
                    error: err
                });
            }

            if(!isMatched) {
                res.json({
                   success: false,
                   title: 'Error',
                   message: 'Password does not match' 
                });
            } else {
                jwt.sign({user: user}, config.secretKEY, {
                    expiresIn: 18000
                }, (err, token) => {
                    if(err) {
                        return res.json({
                            success: false,
                            title: 'Error',
                            message: 'Error authenticating',
                            error: err
                        });
                    }

                    res.json({
                        success: true,
                        title: 'Success',
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

//Get Single User
router.get('/profile/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
    User.getUserById(req.params.id, (err, user) => {
        if(err) {
            return res.json({
                success: false,
                title: 'Error',
                message: 'Error fetching User by Id',
                error: err
            });
        }

        let issuedAt = new Date(req.authInfo.issuedAt*1000);

        res.json({
            success: true,
            title: 'Success',
            message: 'User data fetched',
            issuedAt: issuedAt,
            user: user
        });
    });
});

module.exports = router;