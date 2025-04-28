
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');
const reviewRouter = require('./routes/reviewRouts'); 
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const appointmentRouter = require('./routes/appointmentRouter');
const viewRouter = require('./routes/viewRouts');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))




// servering Static files
app.use(express.static(path.join(__dirname,'public')));
// 1) Global MiddleWare
console.log(process.env.NODE_ENV)
app.use(helmet());
if(process.env.NODE_ENV ==='development'){
  app.use(morgan('dev'));
}



app.use(cors({
  origin: 'https://lastonefortoday.onrender.com',  // allow your deployed frontend
  credentials: true                                // if you send cookies
}));

app.options('*', cors());

//////////////////i have add for the cookie sending policy/////////////////// 
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "http://127.0.0.1:3001"] 
    }
  })
);
/////////////////////////////////////////////////////////////////////////////


// limit request from the same api
const limiter = rateLimit({
  max:100,
  windowMs:60 * 60 * 1000,
  message:'Too Many Request from this Ip , placese try again in an  hour!'
})

app.use('/api',limiter);


//Body parse , reading data from body into req.body
app.use(express.json({limit:'10kb'})); 
app.use(express.urlencoded({extended:true,limit:'10kb'}))
app.use(cookieParser());
//Data sanitizations against noSQL query injections 
app.use(mongoSanitize());
//Data sanitizations against xss
app.use(xss());



// app.use(express.static(`${__dirname}/public`)) // these are necessary for the understanding the JSON data
//Test middleware 
app.use((req, res, next) => {
  console.log('Cookies:', req.cookies);
  next();
});

app.use((req,res,next)=>{
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
})



const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const { title } = require('process');



//Routes 

app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);

app.use('/api/v1/appointments', appointmentRouter); 
 
app.all('*',(req,res,next)=>{
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status = 'fail';
  // err.statusCode = 404
  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
})

app.use(globalErrorHandler);
module.exports = app;
