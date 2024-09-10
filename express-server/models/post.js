const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({

    content: {
        type: String,
        required: 'Content is required',
    },
    image: {
        url: {
            type: String,
            default: 'https://placehold.co/400x400.png?text=post'
        },
        public_id: {
            type: String,
            default: Date.now().toString()
        }
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    }

}, { timestamps: true });

// Create text index on the 'content' field
postSchema.index({ content: "text" });

module.exports = mongoose.model('Post', postSchema);
