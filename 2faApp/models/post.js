const mongoose = require('mongoose');
const config = require('../config/database');

const PostSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.addPost = function(newPost, callback){
  newPost.save(callback);
  }

module.exports.getPostsByUsername = function(username, callback){
  Post.find({username: username}, callback);
  }
