const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Appoint = require('../models/appointmentModel');
const crypto = require('crypto');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const {promisify} = require('util');
const Email = require('../util/eamil');
const helmet = require('helmet');


const signToken = id =>{
    return  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });

}


const createSendToken = (user,statusCode,res)=>{
    const token = signToken(user._id);
    const cookieOptions = {
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
   
        httpOnly:true
    }

    if(process.env.NODE_ENV ==='productions') cookieOptions.secure = true;
    res.cookie('jwt',token,cookieOptions);

    user.password = undefined; // remove the password from the output 

    res.status(statusCode).json({
        status:"success",
        token,
            data:{
                user
            }
        }
    );
}

exports.signup = catchAsync(async(req,res,next) => {
    const newUser = await User.create(req.body);
    const url = `${req.protocol}://${req.get('host')}/me`;
    console.log(url);
    await new Email(newUser,url).sendWelcome();
    console.log('email send successfully');
    createSendToken(newUser,201,res);
});



exports.appoint = catchAsync(async(req,res,next) => {
    const newAppoint = await Appoint.create(req.body);
    console.log(req.body);
    const url = `${req.protocol}://${req.get('host')}/appoint`;
    console.log(url);
    await new Email(newAppoint,url).sendWelcome();
    console.log('email send successfully');
    createSendToken(newAppoint,201,res);
});



exports.login = async(req,res,next) =>{
    const {email,password} = req.body;
    // 1. check if email and password exist
    if(!email|| !password){
       return  next(new AppError('place provide email and password!',404));
    }
    //2. check if user exists && send token to client 
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401));
    }

    console.log(user);
    //3. if everything ok ,send token to client 
    createSendToken(user, 200, res);
};



exports.logOut = (req,res)=>{
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now() + 10 * 1000),
        httpOnly : true
    });
    res.status(200).json({status:'success'});
};






exports.protect = catchAsync(async(req,res,next)=>{
    let token; 
    //1. Getting token and check of it's there 
     if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];    
    }else if( req.cookies.jwt){
        token = req.cookies.jwt;
    }


    // console.log(token);
    if(!token){
        return next(new AppError('You are not logged in ! place log in to get access',401));
    }
    //2. varification token 
   const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    // console.log(decoded);
    //3. Check if user still exists
    const currnetUser = await User.findById(decoded.id);
    if(!currnetUser){
        return next(new AppError('The user belonging to this token no longer exist',401));
    }
    //4. Check if user chane password after the JWT token was issued 
    if(currnetUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('user recently chaned password ! please log in again',401))
    };

    // grant access to protected route 
    req.user = currnetUser;
    res.locals.user = currnetUser
    next();
});



// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
  
        // 2) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }
  
        // 3) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }
  
        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  }



exports.restrictTo = (...role) =>{
    return(req,res,next) =>{
        // roles ['admin' , 'lead-guid'].role='user'
        if(!role.includes(req.user.role)){
            return next(
                new AppError('you do not have permission to perform this action',401)
            );
        }
        next();
    }
} 

exports.forgotPassword = catchAsync(async(req,res,next)=>{
    // 1. Get user based on Post email
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return next(new AppError('There is no user with email address',404));
        }

    // 2. generate the random reset token 
        const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave:false});
    // 3. send it to user's email
    
    
    try{
        
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    
        await new Email(user,resetURL).sendPasswordReset();

        res.status(200).json({
            status:'sucess',
            message:'Token sent to email'
        }); 
    }catch(err){
        user.passwordResetToken= undefined;
        user.passwordResetExpires= undefined;
        await user.save({validateBeforeSave:false});

        return next(new AppError('There was an error sending the email. Try again later!',500));
    }

});

exports.resetPassword = catchAsync(async (req,res,next) =>{
    //1 get user based on the token 
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken:hashedToken, passwordResetExpires:{$gt:Date.now()}});
    //2 it token has not expired , and there is user, set the new passowrd
    if(!user){
        return next(new AppError('Token is invalid or has expried',400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user,200,res);
});

exports.updatePassword =catchAsync(async(req,res,next) =>{
    //1.get user from collection
    const user = await User.findById(req.user.id).select('+password');
    //2.check if posted current password is correct 
    if(!user.correctPassword(req.body.passwordConfirm,user.password)){
        return next(new AppError('Your current password is wrong',401));
    }
    //3. if so, update password 
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //4. log user in , send JWT
    createSendToken(user,200,res);
});