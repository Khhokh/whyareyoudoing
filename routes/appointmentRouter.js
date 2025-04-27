const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

// Public Routes (No authentication needed)
router.post('/appoint',authController.isLoggedIn,authController.restrictTo('user'),
        reviewController.setTourUserIds,appointmentController.createAppointment); // Creating an appointment
router.get('/', authController.protect, appointmentController.getAllAppointments); // Get all appointments
router.get('/:id', authController.protect, appointmentController.getAppointment); // Get appointment by ID

// Protect all the routes below this line
router.use(authController.protect); 

// // User-specific Routes
// router.get('/my-appointments', appointmentController.getMyAppointments); // Get appointments for logged-in user
// router.patch('/:id/status', appointmentController.updateAppointmentStatus); // Update appointment status (scheduled, confirmed, completed, cancelled)
// router.delete('/:id', appointmentController.deleteAppointment); // Delete an appointment

// // Admin-specific Routes (Restrict access to admins)
// router.use(authController.restrictTo('admin')); 

// // Admin can manage all appointments (get, update, delete)
// router.route('/')
//   .get(appointmentController.getAllAppointments) // Admin: Get all appointments
//   .post(appointmentController.createAppointment); // Admin: Create a new appointment

// router.route('/:id')
//   .get(appointmentController.getAppointment) // Admin: Get a specific appointment
//   .patch(appointmentController.updateAppointmentStatus) // Admin: Update status
//   .delete(appointmentController.deleteAppointment); // Admin: Delete an appointment

module.exports = router;
