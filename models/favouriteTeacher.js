var mongoose = require('mongoose');
const Schema = mongoose.Schema
const { ObjectId } = require('mongoose');
var FavouriteSchema = new Schema({
    studentId : {
        type:ObjectId,
        ref:'User',
    },
    teachersId:{
        type:[ObjectId],
        ref:'User',
    }
} , {timestamps:true})
module.exports = mongoose.model('favouriteTeacher', FavouriteSchema);