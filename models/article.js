const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title_1: {
        type: String,
        required: true
    },
    title_2: {
        type: String,
        required: true
    },
    content_1: {
        type: String,
        required: true
    },
    content_2: {
        type: String,
        required: true
    },
    imageUrl: {
        type: [String],
        required: false
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);