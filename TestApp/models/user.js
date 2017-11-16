const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Users schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  twofactor: {
    type: Object
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

module.exports.setupTwoFactor = function(user, twofactor, callback){
  var query = { 'username': user.username }
  User.findOneAndUpdate(query, { $set: { 'twofactor': twofactor } }, (err, doc) => {
    if (err) throw err;
    callback(null, user);
  })
}

module.exports.changeName = function(username, name, callback){
  var query = { 'username': username }
  User.findOneAndUpdate(query, { $set: { 'name': name } }, (err, doc) => {
    if (err) throw err;
    callback(null, username);
  })
}

module.exports.changeEmail = function(username, email, callback){
  var query = { 'username': username }
  User.findOneAndUpdate(query, { $set: { 'email': email } }, (err, doc) => {
    if (err) throw err;
    callback(null, username);
  })
}

module.exports.changePassword = function(username, password, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      password = hash;
      console.log(password);
      var query = { 'username': username }
      User.findOneAndUpdate(query, { $set: { 'password': password } }, (err, doc) => {
        if (err) throw err;
        callback(null, username);
      })
    });
  });
}

module.exports.searchForUsers = function(searchName, callback) {
  var query = {username: ""};
  query.username = new RegExp(searchName, 'g');
  User.find(query, callback);
}
