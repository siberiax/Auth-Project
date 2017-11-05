const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//Register
router.post('/register', (req, res, next) => {
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

//Authenticate
// router.post('/authenticate', (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//
//   User.getUserByUsername(username, (err, user) => {
//     if (err) throw err;
//     if (!user){
//       return res.json({success: false, msg: "user not found"});
//     }
//     User.comparePassword(password, user.password, (err, isMatch) => {
//       if (err) throw err;
//       if (isMatch){
//          const token = jwt.sign({data: user}, config.secret, {
//            expiresIn: 604800
//          });
//          console.log(jwt.verify(token, config.secret));
//         res.json({success: true,
//           token: 'JWT ' + token,
//           user: {
//             id: user._id,
//             name: user.name,
//             username: user.username,
//             email: user.email
//           }
//         });
//       } else {
//         res.json({success: false, msg: "wrong password"});
//       }
//     });
//   });
// });

router.post('/isAuthenticated', (req, res, next) => {
    console.log(req);
})


//profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json(req.user);
});

module.exports = router;
