const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const yachtSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    status: {
        type: String
    }
});

mongoose.model('yachts', yachtSchema)