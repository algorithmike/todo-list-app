const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
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
        unique: true,
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
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// 'virtual' is not actually stored in the User document in the DB.
// They're virtual fields for relationships for Mongoose.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // The '_id' of this User model...
    foreignField: 'owner' // is the 'owner' in the related Task model

})

// 'methods' are accessible on the user instances.
userSchema.methods.toJSON = function() {
    userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const token =  await jwt.sign({ _id:  this._id.toString()}, 'placeholderPrivateKey')

    this.tokens = this.tokens.concat({token})
    await this.save()

    return token
}

// 'statics' are accessible on the User model.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to login.')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login.')
    }

    return user
}


// 'pre' are performed before executing a function
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ owner: this._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User