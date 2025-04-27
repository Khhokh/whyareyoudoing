const Tour = require('../models/tousModels');
const APIFeatures = require('../util/catchAsync');
const User = require('../models/userModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const factory = require('./handlerFactory');



const filterObj =  (obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(el =>{
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async(req, res) => {
//   const users  = await User.find();

//   res.status(200).json({
//     status:'sucess',
//     results:users.length,
//     data:{
//       users
//     }
//   });
// });


exports.updateMe = catchAsync(async(req,res,next) =>{
  // 1 create error if user postes password data 
  if(req.body.passwrod || req.body.passwordConfirm){
    return next(new AppError('this route is not for password update.please use /updatePassword',400));
  }

  //2 Update user document 
  const user = await User.findById(req.user.id);
  user.name = 'jonas';

  //filtered out unwanted fields name that are not allowed to be updated 
  const filterBody = filterObj(req.body,'name','email');

  const updateUser = await User.findByIdAndUpdate(req.user.id,filterBody,{
    new: true,
    runValidators: true
  })
  res.status(200).json({
    status:'success',
    data:{
      user:updateUser
    }
  });
});


exports.deleteMe = catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false});
  
  res.status(204).json({
    status:'success',
    data:null
  });
})

exports.getMe = (req,res,next) =>{
  req.params.id = req.user.id;
  next();
}

// exports.getUser = (req,res) =>{
//   res.status(500).json({
//     status:'error',
//     message:'This route is not yet bedined'
//   })
// };

exports.createUser = (req,res)=>{
  res.status(500).json({
    status:'error',
    message:'this route is not yet defined!'
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser  = factory.deleteOne(User);