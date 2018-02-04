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
        type: String,
        required: true
    },
    status: {
        type: String
    },
    user: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    client:{
        type: String
    },
    datecreated:{
        type: String,
    }
  
});

mongoose.model('yachts', yachtSchema)