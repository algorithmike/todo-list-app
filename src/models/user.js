const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
       type: String,
       required: true,
       trim: true
    },
    age: {
       type: Number,
       default: 0,
       validate(value){
           if(value < 0) throw new Error('Age must be a positive number.')
       }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Must use a valid email address.')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.includes("password")) throw new Error('Password must not contain the word, "passwrod".')
        }
    }
})

module.exports = User