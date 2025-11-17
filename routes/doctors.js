const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create doctor
router.post('/', auth, async (req, res) => {
  try{
    const { userId, specialty, phone } = req.body;
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: 'User not found' });
    const doctor = new Doctor({ user: user._id, specialty, phone });
    await doctor.save();
    res.json(doctor);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctors
router.get('/', auth, async (req, res) => {
  try{
    const doctors = await Doctor.find().populate('user', 'name email');
    res.json(doctors);
  }catch(err){
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
