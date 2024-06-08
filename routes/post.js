const mongoose = require('mongoose');


// Define the post schema
const postSchema = new mongoose.Schema({
        postText: {
            type: String,
            required: true,
            trim: true
        },
        image:{
            type: String
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        likes: {
            type: Array,
            default: []
        }
    },
    {
    timestamps: true
});

// Create the post model
module.exports = mongoose.model('Post', postSchema);

