const mongoose = require('mongoose');
const mongooseUnique = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    parent: {
        type: String
    },
    code: {
        type: String
    }
});

LanguageSchema.plugin(mongooseUnique);

const Language = module.exports = mongoose.model('Language', LanguageSchema);

module.exports.getLanguages = (callback) => {
    Language.find()
        .select('-__v')
        .exec(callback);
}

module.exports.getLanguagesByIds = (languageIds, callback) => {
    let query = {_id: {$in: languageIds}};
    Language.find(query)
        .select('-__v')
        .exec(callback);
}

module.exports.addLanguage = (newLanguage, callback) => {
    newLanguage.save(callback);
}

module.exports.editLanguage = (id, element, callback) => {
    Language.findByIdAndUpdate(id, element)
        .exec(callback);
}