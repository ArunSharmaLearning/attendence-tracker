var mongoose = require('mongoose');
const Schema = mongoose.Schema
var teacherSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: 'This field is required'
    },
    email: {
        type: String,
        unique: true,
        required: 'This field is required'
    },
    phoneNumber: {
        type: String,
        required: 'This field is required'
    },
    password:{
        type: String,
        unique:true,
        required: 'This field is required'
    }
})
module.exports = mongoose.model('Teacher', teacherSchema);