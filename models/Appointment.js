const mongoose = require('mongoose');
const {Schema} = mongoose
const AppointmentSchema = new Schema({
    doctorid:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'doctor'
    },
    name:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true,
        unique: true
    },
    adhaarno:{
        type:Number,
        required:true,
        unique: true
    },
    doctor:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now 
    }
  });

  Appointment = mongoose.model('appointment',AppointmentSchema)
  Appointment.createIndexes()
  module.exports = mongoose.model('appointment',AppointmentSchema)