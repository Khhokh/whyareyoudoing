const Appointment = require('../models/appointmentModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const Email = require('../util/eamil');

// Create a new appointment
exports.createAppointment = catchAsync(async (req, res, next) => {
  // Add user and doctor references automatically (you might want to pass these as part of req.body)
  const {doctor,name, email, phone, dateOfBirth, patientType, insurance, appointmentType, appointmentDate, appointmentTime, notes } = req.body;

  const newAppointment = await Appointment.create({
    doctor,
    name,
    email,
    phone,
    dateOfBirth,
    patientType,
    insurance,
    appointmentType,
    appointmentDate,
    appointmentTime,
    notes,
    user,
    tour
  });

  // Send email to the user after appointment creation
  const url = `${req.protocol}://${req.get('host')}/appoint`;
  await new Email(newAppointment, url).sendAppointment();
  console.log('email send successfully');
  res.status(201).json({
    status: 'success',
    data: {
      appointment: newAppointment
    }
  });
});

// Get all appointments
exports.getAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find().populate('user doctor');

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: {
      appointments
    }
  });
});

// Get appointment by ID
exports.getAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id).populate('user doctor');
  
  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      appointment
    }
  });
});

// Update appointment status
exports.updateAppointmentStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  
  // Check for valid status
  if (!['scheduled', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }

  // Update status
  appointment.status = status;
  await appointment.save();

  res.status(200).json({
    status: 'success',
    data: {
      appointment
    }
  });
});

// Delete an appointment
exports.deleteAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    return next(new AppError('No appointment found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get appointments for the logged-in user
exports.getMyAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find({ user: req.user.id }).populate('doctor');

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: {
      appointments
    }
  });
});
