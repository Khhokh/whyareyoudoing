const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { route } = require('./tourRoutes');

const router = express.Router();


router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logOut',authController.logOut);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);




// router.post('/appoint',authController.appoint);




//Protect all the routes 
router.use(authController.protect); // now this will act as an middle ware to the router of the below routes where it will add the protect middle functions 


router.patch('/updateMe',userController.updateMe);
router.delete('/deleteMe',userController.deleteMe);
router.patch('/updateMyPassword',authController.updatePassword)
router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin')); 

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;