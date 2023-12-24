const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
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
    productCode: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model('Product', productSchema);