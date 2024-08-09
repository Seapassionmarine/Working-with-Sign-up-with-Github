const express = require('express')
const passport = require('passport')
const { createUser, homePage, socialAccount, extractInfo, logOut } = require("../controller/userC")

const router = express.Router()

router.post('/sign-up', createUser)
router.get('/homepage', homePage)
router.get('/signupwithgithub', socialAccount)
router.get('/auth/github', passport.authenticate('github', 
    { scope: [ 'email','profile' ] }), (req, res)=>{
        console.log(req.user);
    });
router.get('/github/callback', passport.authenticate('github', 
  { successRedirect:'/api/v1/user/success/signup',
    failureRedirect: '/homepage' }));
router.get('/success/signup', extractInfo)
router.post('/log-out', logOut)

module.exports = router