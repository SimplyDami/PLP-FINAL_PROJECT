const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phone: String,
  address: String,
  dob: Date,
  gender: String,
  medicalHistory: [String]
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
