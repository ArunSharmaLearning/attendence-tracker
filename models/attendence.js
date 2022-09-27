var mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = require('mongoose');
var attendenceSchema = new Schema({
    userId : {
        type:ObjectId,
        ref:'User'
    },
    attendence: {
        type: Number,
        default: 0
    },
    late:{
        type:Number,
        default:0
    }
} , {timestamps:true})

module.exports = mongoose.model('Attendence', attendenceSchema);