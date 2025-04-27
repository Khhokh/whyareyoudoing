const Tour = require('../models/tousModels');
const catchAsync = require('../util/catchAsync');
const User = require('../models/userModel');
const axios = require('axios');
const ML_API_URL = "http://127.0.0.1:5000/predict"; 
exports.getOverView = catchAsync(async(req,res)=>{
    // 1. get tour data from collection
    const tours = await Tour.find();
    // 2. Build template 
    // 3. Render the template using tour data from (1)
    res.status(200).render('overview',{
      title:'All Doctors',
      tours
    });
})

exports.getMedicat = catchAsync(async(req,res)=>{
  const tour = await Tour.find();
  res.status(200).render('index',{
    title:'Home Page',
    tour
  })
})

exports.getPredcitonsDoc = catchAsync(async(req,res)=>{
  res.status(200).render('prediction',{
    title:'Prediction Model'
  })
})

exports.getTour = catchAsync(async(req,res)=>{
  // 1) get the data for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({slug:req.params.slug}).populate({
      path:'reviews',
      fields:'review raing user'
    });

    if (!tour) {
      return next(new AppError('There is no tour with that name.', 404));
    }
  //2) Build template 
  //3) render templage using data from 1)
    res.status(200).render('tour',{
      title:'The Forest Hiker Tour',
      tour
    });
})

exports.getLoginForm = catchAsync(async(req,res,next)=>{
  res.status(200).render('login',{
    title:'login into your account'
  });
})

exports.getAccont = catchAsync(async(req,res)=>{
  res.status(200).render('account',{
    title:'Your account'
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.getPredcitons = catchAsync(async (req, res) => {
  try {
    const symptoms = req.body.symptoms;
    const response = await axios.post(ML_API_URL, { symptoms });
    res.render("result", { prediction: response.data.predicted_disease });
    // console.log(response.data.predicted_disease);
  } catch (err) {
    console.error("Error:", err);
    res.render("result", { prediction: "Error during prediction" });
  }
});


exports.getSingup = catchAsync(async(req,res)=>{
  res.status(200).render('signup',{
    title:'Your account'
  });
})

exports.getPredcitonsForm = catchAsync(async(req,res)=>{
  res.status(200).render('prediction',{
    title:'prediction form'
  });
})

exports.getWelComePage = catchAsync(async(req,res)=>{
  res.status(200).render('welcome',{
    title:'welcomePage'
  })
})

exports.getAppointment = catchAsync(async(req,res)=>{
  const tourName = req.query.tour || 'No tour selected';
  res.status(200).render('appointment', {
    title: 'Appointment',
    tourName: tourName
})
})
