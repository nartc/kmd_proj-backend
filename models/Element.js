const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Language = require('./Language');

const ElementSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    languages: [{
        type: Schema.Types.ObjectId,
        ref: 'Language'
    }],
    content: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    thumbsUp: {
        type: Number,
        default: 0
    },
    thumbsDown: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//Set Element Model
const Element = module.exports = mongoose.model('Element', ElementSchema);

//Exported Functions
module.exports.addElement = (newElement, callback) => {
    console.log(newElement);
    newElement.save(callback);
}

module.exports.getAllElements = (callback) => {
    Element.find()
        .populate('user', '-password -__v')
        .populate('languages', '-__v')
        .exec(callback);
}

module.exports.getElementByUser = (id, callback) => {
    let query = {user: id};
    Element.find(query)
        .populate('user', '-password')
        .exec(callback);
}


