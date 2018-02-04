const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin:{
        type: Boolean,
        default: false
    }
});

mongoose.model('users', userSchema);