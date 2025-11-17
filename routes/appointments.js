const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// Create appointment
router.post('/', auth, async (req, res) => {
  try{
    const { patientId, doctorId, date, reason } = req.body;
    const patient = await Patient.findById(patientId);
    if(!patient) return res.status(404).json({ message: 'Patient not found' });
    const appointment = new Appointment({ patient: patient._id, doctor: doctorId, date, reason });
    await appointment.save();
    res.json(appointment);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments
router.get('/', auth, async (req, res) => {
  try{
    const appoints = await Appointment.find().populate('patient').populate('doctor');
    res.json(appoints);
  }catch(err){
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
