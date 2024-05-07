const mongoose = require('mongoose');
const {Schema} = mongoose
const PatientSchema = new Schema({
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'doctor'
    },
    name:{
        type: mongoose.Schema.Types.String,
        ref:"appoinment"
    },
    mobile:{
        type: mongoose.Schema.Types.Number,
        ref:"appoinment"
    },
    problem:{
        type: String,
        required: true
    },
    adhaarno:{
        type: mongoose.Schema.Types.Number,
        ref:"appointment"
    },
    description:{
        type: String,
        required: true
    },
    bed:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    }
  });

module.exports = mongoose.model('patient',PatientSchema)