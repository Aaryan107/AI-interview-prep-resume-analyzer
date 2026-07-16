const mongoose = require('mongoose')
const { type } = require('node:os')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [ true, 'Username is required' ],
        unique: true
    },
    email: {
        type: String,
        required: [ true, 'Email is required' ],
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel= mongoose.model('User', userSchema)

module.exports=userModel