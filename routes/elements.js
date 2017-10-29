const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');

const Element = require('../models/Element');
const User = require('../models/User');
const Language = require('../models/Language');

//Add this to the route you want to protect: 'passport.authenticate('jwt', {session:false})'
//example: router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {});

//Add Element
router.post('/add', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error getting User by Id',
                error: err
            });
        }

        if (!user) {
            return res.json({
                success: false,
                message: 'Not Authenticated'
            });
        }

        let newElement = new Element({
            type: req.body.element.type,
            title: req.body.element.title,
            description: req.body.element.description,
            content: req.body.element.content,
            user: user
        });

        //TODO: Role
        let languageIds = _.map(req.body.element.languages, '_id');

        Language.getLanguagesByIds(languageIds, (err, languages) => {
            console.log()
            if (err) {
                return res.json({
                    success: false,
                    title: 'Error',
                    message: 'Error getting Languages by Ids',
                    error: err
                });
            }

            newElement.languages = languages;

            Element.addElement(newElement, (err, element) => {
                if (err) {
                    return res.json({
                        success: false,
                        title: 'Error',
                        message: 'Error adding new Element',
                        error: err
                    });
                }

                user.elements.push(element._id);
                user.save();

                res.json({
                    success: true,
                    title: 'Success',
                    message: 'New element added',
                    element: element
                });
            });
        });
    });
});


//Get All Elements
router.get('/', (req, res) => {
    Element.getAllElements((err, elements) => {
        if(err) {
            return res.json({
                success: false,
                title: 'Error',
                message: 'Error fetching elements',
                error: err
            });
        }

        res.json({
            success: true,
            title: 'Success',
            message: 'All elements fetched',
            elements: elements
        });
    });
});


module.exports = router;