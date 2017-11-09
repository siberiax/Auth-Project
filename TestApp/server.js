const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');

// Port Number
const port = 3000;

// Initialize variable
var secret = ""

// Set Static Folder
app.use(express.static(__dirname + "/public"));

// Body Parser Middleware
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())

require('./config/passport.js')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

function authCheck(req, res, next){
  console.log(req.cookies.auth);
  var token = req.cookies.auth;
  try {
    jwt.verify(token, config.secret)
    return next();
  } catch (e) {
    res.redirect('/login');
  }
}

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/index.html'))
// });

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/register.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'))
})

app.get('/2fa', authCheck,(req, res) => {
  res.sendFile(path.join(__dirname, '/public/2fa.html'))
})

app.get('/twoFactorSetup', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/twoFactorSetup.html'))
})

app.post('/twoFactorSetup', function(req, res){
    secret = speakeasy.generateSecret({length: 10});
    QRCode.toDataURL(secret.otpauth_url, (err, data_url)=>{
      var twofactor = {
         secret: "",
         tempSecret: secret.base32,
         dataURL: data_url,
         otpURL: secret.otpauth_url
      };
      console.log(req.body);
      User.setupTwoFactor(req.body, twofactor, (err, user) =>{
        if (err) throw err;
        console.log(user);
        return res.json({
            message: 'Verify OTP',
            tempSecret: secret.base32,
            dataURL: data_url,
            otpURL: secret.otpauth_url,
            username: user.username
        });
      });
    });
});

app.post('/twoFactorVerify', function(req, res) {

    console.log(req.body.otp);
    var username = req.body.username;
    console.log(username);
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user){
        return res.json({success: false, msg: "user not found"});
      }
      console.log(user.twofactor.tempSecret)

      var verified = speakeasy.totp.verify({
        secret: user.twofactor.tempSecret,
        encoding: 'base32',
        token: req.body.otp
      });

      if(verified) {
        console.log("verified");
        QRCode.toDataURL(secret.otpauth_url, (err, data_url)=>{
          var twofactor = {
             secret: user.twofactor.tempSecret,
             tempSecret: "",
             dataURL: data_url,
             otpURL: secret.otpauth_url
          };
          console.log(twofactor);
          User.setupTwoFactor(user, twofactor, (err, usr) =>{
            if (err) throw err;
            return res.json({
              success: true,
              msg: "Two-factor auth enabled",
              twoFA: twofactor
            });
          });
        });
      }
      else {
        return res.json({success: false, msg: "Invalid token, verification failed"});
      }
    });
});

app.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user){
      return res.json({success: false, msg: "user not found"});
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch){
         const token = jwt.sign({data: user}, config.secret, {
           expiresIn: 604800
         });
         res.cookie('auth', token);
          res.json({success: true,
          token: token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        res.json({success: false, msg: "wrong password"});
      }
    });
  });
});

app.post('/register', (req, res, next) => {
  console.log(req.body);
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  User.addUser(newUser, (err, user) => {
    if (err){
      res.json({success: false, msg: 'failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });

});

app.get('/logout', (req, res) => {
  app.set('token', null);
  res.redirect('/')
})

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
