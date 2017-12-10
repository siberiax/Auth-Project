const mongoose = require('mongoose');
const config = require('../config/database');

const FollowSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  following: {
    type: String,
    required: true
  }
});

const Follow = module.exports = mongoose.model('Follow', FollowSchema);

module.exports.addFollow = function(follow, callback){
  follow.save(callback);
  }

module.exports.deleteFollow = function(user1, user2, callback){
  Follow.remove({username: user1, following: user2}, (err, doc) => {
    if (err) throw err;
    callback(null);
  });
}

module.exports.getFollow = function(user1, user2, callback){
  Follow.findOne({username: user1, following: user2}, (err, doc) => {
    if (err) throw err;
    callback(null, doc);
  });
}

module.exports.getFollowing = function(username, callback){
  Follow.find({username: username}, (err, doc) => {
    if (err) throw err;
    callback(null, doc);
  });
}

module.exports.getFollowers = function(username, callback){
  Follow.find({following: username}, (err, doc) => {
    if (err) throw err;
    callback(null, doc);
  });
}
