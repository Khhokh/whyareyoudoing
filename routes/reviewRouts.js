const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const User = require('../models/userModel');

const router = express.Router({mergeParams:true})
// const router = express.Router();

router.use(authController.protect); // same like in the userRouter 

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('user','admin'),reviewController.updateReview)
    .delete(authController.restrictTo('user','admin'),reviewController.deleteReview);
module.exports = router;
