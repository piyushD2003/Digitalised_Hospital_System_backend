const mongoose = require('mongoose');
const {Schema} = mongoose
const AdminSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type:Date,
        default: Date.now
    }
  });
  const Admin = mongoose.model('admin',AdminSchema)
  Admin.createIndexes()
  module.exports = mongoose.model('admin',AdminSchema)