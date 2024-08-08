const mongoose = require('mongoose')
 
const userSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String
    },
    profilePicture:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    signUpOption:{
        type:String
    }

},{timestamps:true})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel