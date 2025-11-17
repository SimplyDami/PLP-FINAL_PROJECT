const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ilorin_ehospital';

async function seed(){
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});
  await Patient.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});

  const admin = new User({ name: 'Admin', email: 'admin@hospital.test', password: 'password', role: 'admin' });
  await admin.save();
  const drUser = new User({ name: 'Dr John', email: 'dr.john@hospital.test', password: 'password', role: 'doctor' });
  await drUser.save();
  const patientUser = new User({ name: 'Jane Doe', email: 'jane@patient.test', password: 'password', role: 'patient' });
  await patientUser.save();

  const doctor = new Doctor({ user: drUser._id, specialty: 'General' });
  await doctor.save();
  const patient = new Patient({ user: patientUser._id, phone: '0800000000' });
  await patient.save();

  const appt = new Appointment({ patient: patient._id, doctor: doctor._id, date: new Date(), reason: 'Checkup' });
  await appt.save();

  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
