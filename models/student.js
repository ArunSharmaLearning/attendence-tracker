const { ObjectId } = require('mongoose');
var mongoose = require('mongoose');
const Schema = mongoose.Schema
var studentSchema = new Schema({

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
        unique:true
    },
    password:{
        type: String,
        unique:true,
        required: 'This field is required'
    },
    favourites:
    [
        {
            type:ObjectId,
            ref:'Teacher'
        }
    ]
})

module.exports = mongoose.model('Student', studentSchema);