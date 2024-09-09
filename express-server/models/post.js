const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema();

const postSchema = mongoose.Schema({

    content: {
        type: String,
        required: 'Content is required'
    },
    image: {
        url: {
            default: 'https://placehold.co/400x400.png?text=post'
        },
        public_id: {
            default: Date.now()
        }
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    }

}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
