var mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = require('mongoose');
var studentSchema = new Schema({
    favourites:
        [
            {
                type: ObjectId,
                ref: 'Staff'
            },  
        ],
    attendence: {
        type: Number,
        default:0
    },
    reportingTime:{
        type:[Date]
    }
} ,{timestamps:true})

module.exports = mongoose.model('Student', studentSchema);