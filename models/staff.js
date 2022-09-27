var mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = require('mongoose');
var staffSchema = new Schema({
    type: {
        type: String,
        enum: ['teacher', 'counselors', 'nurses', 'social workers'],
        default: 'teacher'
    },
    attendence: {
        type: Number,
        default: 0
    },
    reportingTime:{
        type:[Date]
    }
} , {timestamps:true})
module.exports = mongoose.model('Staff', staffSchema);