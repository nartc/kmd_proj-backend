const express = require('express');
const router = express.Router();

const Language = require('../models/Language');

//Add Languages
router.post('/addMany', (req, res) => {
    for(languageIndex in req.body.languages) {
        let newLanguage = new Language({
            name: req.body.languages[languageIndex].name,
            type: req.body.languages[languageIndex].type,
            code: req.body.languages[languageIndex].code,
            parent: req.body.languages[languageIndex].parent
        });

        Language.addLanguage(newLanguage, (err) => {
            if(err) {
                return res.json({
                    success: false,
                    title: 'Error',
                    messsage: 'Error adding some or all langauges',
                    error: err
                });
            }
        });
    }

    res.json({
        success: true,
        title: 'Success',
        message: 'All languages added'
    });
});

//Get Languages
router.get('/', (req, res) => {
    Language.getLanguages((err, languages) => {
        if(err) {
            return res.json({
                success: false,
                title: 'Error',
                message: 'Error fetching all languages',
                error: err
            });
        }

        res.json({
            success: true,
            title: 'Success',
            message: 'All languages fetched',
            languages: languages
        });
    });
});

module.exports = router;