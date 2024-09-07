const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: {
        required: true,
        index: true,
        type: String
    },
    name: {
        type: String
    },
    email: {
        required: true,
        index: true,
        type: String
    },
    images: {
        type: Array,
        default: {
            url: 'https://placehold.co/200x200.png?text=profile',
            public_id: '123'
        }
    },
    about: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
