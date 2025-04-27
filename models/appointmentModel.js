const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Personal Information (Step 1)
  doctor:{
    type:String
  },
  name: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  patientType: {
    type: String,
    enum: ['new', 'returning'],
    required: [true, 'Patient type is required']
  },
  insurance: {
    type: String,
    default: ''
  },
  appointmentType: {
    type: String,
    required: [true, 'Appointment type is required']
  },

  // Date and Time (Step 2)
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  notes: {
    type: String,
    default: ''
  },
  tour:{
      type:mongoose.Schema.ObjectId,
      ref:'Tour',
      required:[true,'Review must belong to a tour']
  },
  user:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
      required:[true,'Review must belong to a user']
  },
  // System fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  // References
//   doctor: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Doctor',
//     required: [true, 'Appointment must be assigned to a doctor']
//   },
//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: [true, 'Appointment must belong to a user']
//   }
});

// Populate user information when finding appointments
appointmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user', 
    select: 'name photo'
  });
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;