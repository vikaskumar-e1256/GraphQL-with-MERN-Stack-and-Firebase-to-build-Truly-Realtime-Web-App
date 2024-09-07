const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const shortid = require('shortid');


const userSchema = mongoose.Schema({
    username: {
        required: true,
        index: true,
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    email: {
        required: true,
        index: true,
        type: String,
        unique: true
    },
    images: {
        type: Array,
        default: {
            url: 'https://placehold.co/200x200.png?text=profile',
            public_id: shortid.generate()
        }
    },
    about: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
