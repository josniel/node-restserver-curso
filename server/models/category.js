const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        requires: [true, 'Name is required']
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('category', categorySchema);