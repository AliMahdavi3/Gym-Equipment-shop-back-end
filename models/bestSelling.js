const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bestSellingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: [String],
        required: false
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('BestSelling', bestSellingSchema);