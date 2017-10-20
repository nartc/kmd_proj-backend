const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const mongooseUnique = require('mongoose-unique-validator');

const UserSchema = new Schema({
    nickname: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        set: toLower
    },
    password: {
        type: String,
        required: true
    },
    privilege: {
        type: String,
        default: 'Registered'
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    elements: [{
        type: Schema.Types.ObjectId,
        ref: 'Element'
    }]
});

//Set email to lowerCase for future use
function toLower(str) {
    return str.toLowerCase();
}

//Use Unique Plugin
UserSchema.plugin(mongooseUnique);

//Set User Model
const User = module.exports = mongoose.model('User', UserSchema);

//Exported Functions
module.exports.registerUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
                return console.error(`Error hashing newUser password:... ${err}`);
            }

            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.getUserByEmail = (email, callback) => {
    let query = {email: email};
    User.findOne(query, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatched) => {
        if(err) {
            return console.error(`Error comparing password ${err}`);
        }

        callback(null, isMatched);
    });
}

