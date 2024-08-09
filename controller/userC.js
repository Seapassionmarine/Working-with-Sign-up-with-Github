const userModel = require('../model/userM')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')


exports.signUp = async (req, res) => {
    try {
        const { FirstName,LastName,Email,Password } = req.body;
        if (!Email || !FirstName || !LastName || !Password) {
            return res.status(404).json({
                message: `Please enter all details`           
            })
        }
        const existingUser = await userModel.findOne({Email});
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }
        
        const saltedeRounds = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(Password, saltedeRounds);
        
        const user = new userModel({
            FirstName,
            LastName,
            Email:Email.toLowerCase(),
            Password: hashedPassword
        })
        await user.save()

        res.status(201).json({
            message: 'User created successfully', 
            data: user
        })

    } catch (err) {
        if (err.code === 11000) {
            const whatWentWrong = Object.keys(err.keyValue)[0]
            return res.status(500).json({               
                message: `User with this ${whatWentWrong} already exist`
            })
        }else{
            return res.status(500).json(err.message)
        }
    }
}


exports.extractInfo = async(req,res)=>{
    try {
        console.log(req.user);
      const checkUser = await userModel.findOne({email:req.user._json.email})  
      if(checkUser){
        req.session.user = checkUser.Email
        return res.redirect("/api/v1/user/homepage")
      }else{
      const create = new socialModel({
        FirstName: req.user._json.given_name,
        LastName: req.user._json.family_name,
        Email: req.user._json.email,
        profilePicture: req.user._json.picture,
        isVerified: req.user._json.email_verified,
        provider: req.user.provider
      })
      await create.save()
      res.status(201).json({
        message:`Information extracted successfully.`,
        data: create
      })
     }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.homePage = async(req,res) => {
    try {
        if(!req.session.user){
            return res.status(401).json({
                message:'You are not authenticated.'
            })
        }
        else{
            const findUser = await socialModel.findOne({Email: req.session.user})
        return res.status(200).json({
            message:`Welcome,${findUser.FirstName}`
          })
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.socialAccount = (req,res)=>{
    res.redirect('/api/v1/auth/github')
}

exports.logOut = async(req,res)=>{
    try {
        req.session.destroy()
    res.status(200).json({
        message:'User logged out successfully.'
      })
    } catch (err) {
        res.status(500).json(err.message)
    }
}


