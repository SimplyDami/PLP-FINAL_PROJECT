const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create patient record (admin/reception)
router.post('/', auth, async (req, res) => {
  try{
    const { userId, phone, address, dob, gender } = req.body;
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: 'User not found' });
    const patient = new Patient({ user: user._id, phone, address, dob, gender });
    await patient.save();
    res.json(patient);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all patients
router.get('/', auth, async (req, res) => {
  try{
    const patients = await Patient.find().populate('user', 'name email');
    res.json(patients);
  }catch(err){
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by id
router.get('/:id', auth, async (req, res) => {
  try{
    const patient = await Patient.findById(req.params.id).populate('user', 'name email');
    if(!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  }catch(err){
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
