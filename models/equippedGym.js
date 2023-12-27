const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equippedGymSchema = new Schema({
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
    address: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('EquippedGym', equippedGymSchema);