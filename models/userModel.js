const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator'); // here this is the validator package that help us to create validate some rule to the Schema
const { validate } = require('./tousModels');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'place tell us your name']
    },
    email:{
        type:String, 
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:String,
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provid a password'],
        minlength:8,
        select:false // this for the not showing the password when we request all the tours from the database 
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
    },
    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
});




userSchema.pre('save',async function(next){
    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    //Hash the password with cost of 12 
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field 
    this.passwordConfirm = undefined;
    // if (!this.passwordChagedAt) {
    //     this.passwordChagedAt = new Date();
    // }

    next();
})

userSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew) return next();
    this.passwordChangedAt = Date.now()-1000;
    next();
})

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next()
})


userSchema.methods.correctPassword = function(candidatePassword,userPassword){
    // this.password --> it is not available because in the user Schema we set the password = false 
    return bcrypt.compare(candidatePassword , userPassword); // for that above reason we are doing this 
    
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt( this.passwordChangedAt.getTime()/1000);
        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    
}

userSchema.methods.createPasswordResetToken = function(){
   const resetToken = crypto.randomBytes(32).toString('hex');
   this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');

   console.log({resetToken},this.passwordResetToken);

   this.passwordResetExpires = Date.now() + 10*60*1000;
   return resetToken;
}

const User = mongoose.model('User',userSchema);
module.exports = User;