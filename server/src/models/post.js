const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    action: {
        type: String
    }
});

module.exports = mongoose.model('post', postSchema);