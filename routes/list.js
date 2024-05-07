const express = require('express');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const fetchdoctor = require('../middleware/fetchdoctor');
const Doctor = require('../models/Doctor');


// Get all the Appointments, login required
router.get('/fetchallappointment', fetchdoctor, async (req, res) => {
    try {
        const appoinment = await Appointment.find({doctorid:req.doctor.id})
        res.json(appoinment)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
})
//Delete the appoinment
router.put('/deleteappointment/:id', fetchdoctor,
async(req,res)=>{
    try {
        let appoint = await Appointment.findById(req.params.id)
        if(!appoint){return res.status(404).send("Not Found")}
        if (appoint.doctorid.toString() !== req.doctor.id) { return res.status(401).send("Not Allowed") }
        appoint = await Appointment.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", appoint:appoint })
            
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
    }

)
//Fetch all patients
router.get('/fetchallpatient',fetchdoctor, async (req, res) => {
    try {
        const patient = await Patient.find({doctor:req.doctor.id})
        res.json(patient)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
})

//Fetch the all doctors
router.get('/fetchalldoctor', async (req, res) => {
    try {
        const doctor = await Doctor.find({ doctor: req.id })
        res.json(doctor)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
})

//Create the Pateint by Appointment, login required
router.post('/addpatient/:id', fetchdoctor,
async(req,res)=>{
    let appoint = await Appointment.findById(req.params.id)
    if(!appoint){
        return res.status(404).send("Not Found")}
    if (appoint.doctorid.toString() !== req.doctor.id) { return res.status(401).send("Not Allowed") }
    
    const {problem, description, bed} =req.body
    try { 
            const patient = await Patient.create({
                doctor: req.doctor.id,
                name: appoint.name,
                mobile: appoint.mobile,
                adhaarno: appoint.adhaarno,
                description:description,
                problem:problem,
                bed:bed,
            })
            appoint = await Appointment.findByIdAndDelete(req.params.id)
            res.json(patient)
            
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
    }

)

//Create a Patient manually, login required
router.post('/addpatient0', fetchdoctor,[
    body('name', "Enter a valid Name").isLength({ min: 3 }),
    body('mobile', "mobile must be of 11 digits").isLength({ min: 11 }),
    body('adhaarno', "Adhaar no must be of 12 digits").isLength({ min: 12 }),
],
async(req,res)=>{
    const {problem, description, bed, name, mobile, adhaarno} =req.body
    try { 
            const patient = await Patient.create({
                doctor: req.doctor.id,
                name: name,
                mobile: mobile,
                adhaarno: adhaarno,
                description:description,
                problem:problem,
                bed:bed
            })
            res.json(patient)
            
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
    }
)

// remove Patient
router.put('/deletepatient/:id', fetchdoctor,
async(req,res)=>{
    try { 
        let patient = await Patient.findById(req.params.id)
        if(!patient){return res.status(404).send("Not Found")}
        if (patient.doctor.toString() !== req.doctor.id) { return res.status(401).send("Not Allowed") }
        patient = await Patient.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", patient:patient })
            
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
    }

)
// Update Patient Info
router.put('/updatepatient/:id', fetchdoctor, async (req, res) => {
    const {problem, description, bed, name, mobile, adhaarno} = req.body
    try {

        // Create a newNote object
        const newpatient = {}
        if (problem) { newpatient.problem = problem};
        if (name) { newpatient.name = name};
        if (mobile) { newpatient.mobile =mobile };
        if (adhaarno) { newpatient.adhaarno = adhaarno };
        if (bed) { newpatient.bed = bed};
        if (description) { newpatient.description = description };
        // Find the note to be updated and update it
        let patient = await Patient.findById(req.params.id)

        // if note were there then not found response sended
        if (!patient) { return res.status(404).send("Not Found") }

        // if user id in updating note is not matchable to user_id where user logged in then 401 status sended
        if (patient.doctor.toString() !== req.doctor.id) { return res.status(401).send("Not Allowed") }


        patient = await Patient.findByIdAndUpdate(req.params.id, { $set: newpatient }, { new: true })
        res.json({ patient })
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
})
module.exports = router