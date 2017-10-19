const express = require('express');
const router = express.Router();

const Element = require('../models/Element');
const User = require('../models/User');

//Add this to the route you want to protect: 'passport.authenticate('jwt', {session:false})'
//example: router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {});

//Add Element
router.post('/add', passport.authenticate('jwt', {session:false}), (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error getting User by Id',
                error: err
            });
        }

        if(!user) {
            return res.json({
                success: false,
                message: 'Not Authenticated'
            });
        }

        //TODO: Role

        let newElement = new Element({
            type: req.body.element.type,
            title: req.body.element.title,
            description: req.body.element.description,
            content: req.body.element.content,
            user: user
        });

        Element.addElement(newElement, (err, element) => {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Error adding new Element',
                    error: err
                });
            }

            user.elements.push(element._id);
            user.save();

            res.json({
                success: true,
                message: 'Element added successfully',
                element: element
            });
        });
    });
}); 


module.exports = router;