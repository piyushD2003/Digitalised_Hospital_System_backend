const mongoose = require('mongoose');
const {Schema} = mongoose
const DoctorSchema = new Schema({
    dname:{
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
    image:{
        type: String,
        default :""
    },
    specialist:{
        type: String,
        required: true
    },
    study:{
        type:String,
        required:true
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
  const Doctor = mongoose.model('doctor',DoctorSchema)
  Doctor.createIndexes()
  module.exports = mongoose.model('doctor',DoctorSchema)
