const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('SendMessage', messageSchema);
