var mongoose = require('mongoose');
const { ObjectId } = require('mongoose');
const Schema = mongoose.Schema
var bcrypt = require('bcryptjs');

var userSchema = new Schema({

    name: {
        type: String,
        required: 'This field is required'
    },
    email: {
        type: String,
        required: 'This field is required'
    },
    password: {
        type: String,
        required: 'This field is required'
    },
    phoneNumber: {
        type: String,
        required: 'This field is required'
    },
    type: {
        type: String,
        enum: ['student', 'teacher', 'counselor', 'nurse', 'social worker'],
        default: 'student'
    },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    try {
        var user = this
        const hashedPassword = await bcrypt.hash(user.password, 8);
        user.password = hashedPassword
        return next();
    }
    catch (err) {
        console.log(err)
        return next();
    }
})
module.exports = mongoose.model('User', userSchema);