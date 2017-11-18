const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('./models/user');
const Post = require('./models/post');
const Follow = require('./models/follow');
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

app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

function authCheck1(req, res, next){
  var token = req.cookies.auth;
  try {
    jwt.verify(token, config.secret)
    return next();
  } catch (e) {
    res.redirect('/login');
  }
}

function authCheck(req, res, next){
  var token = req.cookies.Authorizaton;
  try {
    jwt.verify(token, config.secret)
    return next();
  } catch (e) {
    res.redirect('/login');
  }
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/register.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'))
})

app.get('/2fa', authCheck1,(req, res) => {
  res.sendFile(path.join(__dirname, '/public/2fa.html'))
})

app.get('/twoFactorSetup', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/twoFactorSetup.html'))
})

app.get('/home', authCheck,(req, res) => {
  res.sendFile(path.join(__dirname, '/public/home.html'))
})

app.get('/settings', authCheck,(req, res) => {
  res.sendFile(path.join(__dirname, '/public/settings.html'))
})

app.get('/profile/:username', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/profile.html'))
})

app.get('/search', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/search.html'))
})

app.get('/following/:username', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/following.html'))
})

app.get('/followers/:username', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/followers.html'))
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
      User.setupTwoFactor(req.body, twofactor, (err, user) =>{
        if (err) throw err;
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

app.post('/twoFactorVerifyLogin', authCheck1, function(req, res){
  var username = req.body.username;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user){
      return res.json({success: false, msg: "user not found"});
    }
    var verified = speakeasy.totp.verify({
      secret: user.twofactor.secret,
      encoding: 'base32',
      token: req.body.otp
    });
    if(verified) {
      res.cookie('Authorizaton', req.cookies.auth);
      res.cookie('auth', null);
      return res.json({
        success: true,
        msg: "Two-factor auth enabled",
      });
    } else {
      return res.json({success: false, msg: "Invalid token, verification failed"});
    }
  });
});

app.post('/twoFactorVerify', function(req, res) {
    var username = req.body.username;
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user){
        return res.json({success: false, msg: "user not found"});
      }
      var verified = speakeasy.totp.verify({
        secret: user.twofactor.tempSecret,
        encoding: 'base32',
        token: req.body.otp
      });
      if(verified) {
        QRCode.toDataURL(secret.otpauth_url, (err, data_url)=>{
          var twofactor = {
             secret: user.twofactor.tempSecret,
             dataURL: data_url,
             otpURL: secret.otpauth_url
          };
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
  var email = req.body.email;
  if (!validateEmail(email)){
    res.json({success: false, msg: 'bad email'});
  } else {
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
  }
});

app.post('/changeName', authCheck, (req, res, next) => {
  var username = req.body.username;
  var name = req.body.name;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user){
      return res.json({success: false, msg: "user not found"});
    }
    User.changeName(username, name, (err, user) => {
      if (err) {
        res.json({success: false, msg: 'Failed to change name'});
      } else {
        res.json({success: true, msg: "Name successfully changed"});
      }
    })
  })
});

app.post('/changeEmail', authCheck, (req, res, next) => {
  var username = req.body.username;
  var email = req.body.email;
  if (!validateEmail(email)){
    res.json({success: false, msg: 'bad email'});
  } else {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user){
        return res.json({success: false, msg: "user not found"});
      }
      User.changeEmail(username, email, (err, user) => {
        if (err) {
          res.json({success: false, msg: 'Failed to change email'});
        } else {
          res.json({success: true, msg: "Email successfully changed"});
        }
      })
    })
  }
});

app.post('/changePassword', authCheck, (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var oldpass = req.body.oldpass
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user){
      return res.json({success: false, msg: "user not found"});
    }
    User.comparePassword(oldpass, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch){
        User.changePassword(username, password, (err, user) => {
          if (err) {
            res.json({success: false, msg: 'Failed to change password'});
          } else {
            res.json({success: true, msg: "Password successfully changed"});
          }
        })
      } else {
        res.json({success: false, msg: "Old Password wrong"});
      }
    })
  })
});

app.post('/getUser', authCheck, (req, res, next) => {
  User.getUserByUsername(req.body.username, (err, user) => {
    if (err) throw err;
    if (!user){
      return res.json({success: false, msg: "user not found"});
    } else {
      return res.json({success: true, msg: "user found", user: user});
    }
  });
});

app.post('/addPost', authCheck, (req, res, next) => {
  if (req.body.post.length > 150){
    res.json({success: false, msg: 'Post is too long'});
  } else {
    let newPost = new Post({
      username: req.body.username,
      post: req.body.post,
      time: req.body.time
    });
    Post.addPost(newPost, (err) => {
      if (err) {
        res.json({success: false, msg: 'Failed to make post'});
      } else {
        res.json({success: true, msg: "post created"});
      }
    });
  }
});

app.post('/getPosts', authCheck, (req, res, next) => {
  Post.getPostsByUsername(req.body.username, (err, posts) => {
    if (err) throw err;
    if (!posts){
      return res.json({success: false, msg: "posts not found"});
    } else {
      return res.json({success: true, msg: "posts found", posts: posts});
    }
  });
});

app.post('/follow', authCheck, (req, res, next) => {
  let newFollow = new Follow({
    username: req.body.username,
    following: req.body.following,
  });
  Follow.addFollow(newFollow, (err) => {
    if (err) {
      res.json({success: false, msg: 'Failed to follow user'});
    } else {
      res.json({success: true, msg: "User now followed"});
    }
  });
});

app.post('/unfollow', authCheck, (req, res, next) => {
  Follow.deleteFollow(req.body.username, req.body.unfollow, (err) => {
    if (err) {
      res.json({success: false, msg: 'Failed to unfollow user'});
    } else {
      res.json({success: true, msg: "User now unfollowed"});
    }
  })
});

app.post('/getFollow', authCheck, (req, res, next) => {
  Follow.getFollow(req.body.username, req.body.following, (err, doc) => {
    if (err) throw err;
    if (doc) {
      res.json({following: true});
    } else {
      res.json({following: false});
    }
  })
});

app.get('/logout', (req, res) => {
  cookie = req.cookies;
  for (var prop in cookie) {
      if (!cookie.hasOwnProperty(prop)) {
          continue;
      }
      res.cookie(prop, '', {expires: new Date(0)});
  }
  res.redirect('/');
})

app.post('/userSearch', authCheck, (req, res, next) => {
  User.searchForUsers(req.body.searchName, (err, users) => {
    if (err) throw err;
    if (!users){
      return res.json({success: false, msg: "no users found"});
    }
    else {
      return res.json({success: true, msg: "user(s) found", users: users})
    }
  });
});

app.post('/getFollowing', authCheck, (req, res, next) => {
  Follow.getFollowing(req.body.username, (err, users) => {
    if (err) throw err;
    if (!users){
      return res.json({success: false, msg: "no users found"});
    }
    else {
      return res.json({success: true, msg: "user(s) found", users: users})
    }
  })
})

app.post('/getFollowers', authCheck, (req, res, next) => {
  Follow.getFollowers(req.body.username, (err, users) => {
    if (err) throw err;
    if (!users){
      return res.json({success: false, msg: "no users found"});
    }
    else {
      return res.json({success: true, msg: "user(s) found", users: users})
    }
  })
})

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
