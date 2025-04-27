const express = require('express');
const tourController = require('../controllers/tourController');
// const {getAllTours} = require('./../controllers/tourController'); ---> this is the destructuring way of doning the above 
const authController = require('../controllers/authController')
const router = express.Router();
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRouts');

// router.param('id',tourController.checkID);

//create a checkbody middleware
//Check if body contains the name and price property 
//if not ,send back 400 (bad request)
// Add it to the post handler stack

// router.route('/:tourId/reviews').post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview
// );

router.use('/:tourId/reviews',reviewRouter);

router
    .route('/tour-stats')
    .get(tourController.getTourStats);

    
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours,tourController.getAllTours);
    
router
    .route('/monthly-plan/:year')
    .get(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.createTour);

router  
  .route('/:id')
  .get(tourController.getTours)
  .patch(tourController.updateTour)
  .delete(authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour);


module.exports = router;















// router.param('id', tourController.checkID);

// router
//   .route('/')
//   .get(tourController.getAllTours)
//   .post(tourController.checkBody, tourController.createTour);

// router
//   .route('/:id')
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(tourController.deleteTour);

// module.exports = router;
