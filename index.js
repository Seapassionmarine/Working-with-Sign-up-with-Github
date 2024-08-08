const express = require('express')
const passport = require('passport')
const GitHubStrategy = require("passport-github2").Strategy
const session = require('express-session')
const router = require('./router/userR.js')
require('./config/dbConfig.js')

const PORT = process.env.port || 1123

const app = express()
app.use(express.json())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.session_secret,
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}))

app.use(passport.initialize())
app.use(passport.session())


passport.use(new GitHubStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      // Assuming user is retrieved from the database or created
      User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(err, user);
      });
  })
);


// Serialize user into the sessions
passport.serializeUser((user, done) => {
    // console.log('Serializing user:', user._json);
     done(null, user); // Storing only user ID in session
   });
   
   // Deserialize user from the sessions
passport.deserializeUser((user, done) => {
     console.log('Deserializing user:', user);
     done(null, user);
   });

app.use('/api/v1/user', router)

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
})
