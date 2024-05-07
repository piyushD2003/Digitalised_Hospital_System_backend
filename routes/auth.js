const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router()
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'piyushisgoodboy'
const bcrypt = require('bcryptjs')
const multer = require('multer')
// const upload = multer({dest:'uploads/'})
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const Appointment = require('../models/Appointment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null,uniqueSuffix+file.originalname)
    }
  })
const upload = multer({ storage: storage })

// Appointment for a user
router.post('/createappointment', [
    body('name', "Enter a valid Name").isLength({ min: 3 }),
    body('mobile', "mobile must be of 10 digits").isLength({ min: 10 }),
    body('adhaarno', "Adhaar no must be of 12 digits").isLength({ min: 12 }),
    body('doctor', "Adhaar no must be of 12 digits").isLength({ min: 5 })
], async(req, res) => {
    // let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    try {
        let doctorName = await Doctor.findOne({ dname: req.body.doctor })
            if (!doctorName) {
                return res.status(400).json({ success, errors: "Selected Doctor does'nt exists" })
            }
            const doctorid = await Doctor.findOne({dname:req.body.doctor},{_id:1})
        const appointment = await Appointment.create({
            name: req.body.name,
            doctorid:doctorid.id,
            mobile: req.body.mobile,
            adhaarno: req.body.adhaarno,
            doctor: req.body.doctor
        })
        res.json(appointment)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// Doctor Account Creation
router.post('/createdoctoracc',upload.single('image'), [
    body('email', "Enter a valid Email").isEmail(),
    body('dname', "Enter a valid Name").isLength({ min: 3 }),
    body('mobile', "mobile must be of 11 digits").isLength({ min: 10 }),
    body('password', "Password must be at least 5 charaters").isLength({ min: 5 }),
    body('study', "Study must be at least 5 charaters").isLength({ min: 5 }),
    body('specialist', "Specialist must be at least 5 charaters").isLength({ min: 6 })
],
    async (req, res) => {
        let success = false
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() })
        }
        try {
            let doctor = await Doctor.findOne({ email: req.body.email })
            if (doctor) {
                return res.status(400).json({ success, errors: "Doctor with this email is already exists" })
            }
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            const imageName = req.file.filename
            doctor = await Doctor.create({
                dname: req.body.dname,
                password: secPass,
                email: req.body.email,
                image :imageName,
                mobile: req.body.mobile,
                study: req.body.study,
                specialist: req.body.specialist,
            })
            const data = {
                doctor: {
                    id: doctor.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            success = true
            res.json({success, authToken})
        } catch(error){
            console.log(error.message);
            res.status(500).send('Internal Server Error')
        }
})

//Admin Account Creation
router.post('/createadmin', [
    body('name', "Enter a valid Name").isLength({ min: 3 }),
    body('email', "Enter a valid Email").isEmail(),
    body('mobile', "mobile must be of 11 digits").isLength({ min: 11 }),
    body('password', "Password must be at least 5 charaters").isLength({ min: 5 }),
],
    async (req, res,next) => {
        let success = false
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() })
        }
        try {
            const adminc = await Admin.find().populate('name')
            if (adminc.length>0) {
                return res.status(400).json({ success, errors: "Admin Already Existed" })
            }
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt)
            const admin = await Admin.create({
                name: req.body.name,
                password: secPass,
                email: req.body.email,
                mobile: req.body.mobile,
            })
            const data = {
                admin: {
                    id: admin.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            success = true
            res.json({success, authToken})
            next()
        } catch(error){
            console.log(error.message);
            res.status(500).send('Internal Server Error')
        }
})
//doctor login
router.post('/logindoctor', [
    // set the property or condition for the information that must be fullfill by user of name, email and password
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password can't be blanked").exists()
],
    async (req, res) => {
        let success = false
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body
        try {
            let doctor = await Doctor.findOne({ email })
            if (!doctor) {
                return res.status(400).json({success, errors: "Please try to login with correct credentials" })
            }
            const passwordCompare = await bcrypt.compare(password, doctor.password)
            if (!passwordCompare) {
                return res.status(400).json({success, errors: "Please try to login with correct credentials" })
            }

            const data = {
                doctor: {
                    id: doctor.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            success = true
            res.json({success, authToken })
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Internal Server Error')
        }
    })

    
//Admin login
router.post('/loginadmin', [
    // set the property or condition for the information that must be fullfill by user of name, email and password
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password can't be blanked").exists()
],
    async (req, res) => {
        let success = false
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body
        try {
            let admin = await Admin.findOne({ email })
            if (!admin) {
                return res.status(400).json({success, errors: "Please try to login with correct credentials" })
            }
            const passwordCompare = await bcrypt.compare(password, admin.password)
            if (!passwordCompare) {
                return res.status(400).json({success, errors: "Please try to login with correct credentials" })
            }

            const data = {
                admin: {
                    id: admin.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            success = true
            res.json({success, authToken })
            console.log("Admin login successful");
        } catch (error) {
            console.log(error.message);
            res.status(500).send('Internal Server Error')
        }
    })
module.exports = router



