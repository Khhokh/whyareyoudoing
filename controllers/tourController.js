
const { networkInterfaces } = require('os');
const Tour = require('../models/tousModels');
const { queryObjects } = require('v8');
const { match } = require('assert');
const APIFeatures = require('../util/apiFeatures');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const factory = require('./handlerFactory');
const { appendFile } = require('fs');

exports.aliasTopTours = (req,res,next) =>{
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields =  'name,price,ratingsAverage,summary,difficulty';
  next();
};

// exports.getAllTours =catchAsync(async (req, res,next) => {
//   const features = new APIFeatures(Tour.find(),req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   // const tours = await query;
//   const tours = await features.query;

//   //SEND THE RESPONSE
//   res.status(200).json({
//       status: 'sucess',
//       result:tours.length,
//       data:{
//         tours
//       }
//     });
// });

//////// aggrigation Pipeline /////////////////////////////////
/* Aggregation pepeline method we are applying multple method in a series to the each data in a step by step by this method 
*/

exports.getTourStats =catchAsync( async(req,res,next)=>{
    const stats =await Tour.aggregate([
      {
        $match:{ratingsAverage:{$gte:4.5}}
      },
      {
        $group:{
          _id:'$difficulty',
          numRating:{$sum:1},
          avgRating:{$avg:'$ratingAverage'},
          avgPrice:{$avg:'$price'},
          minPrice:{$min:'$price'},
          maxPrice:{$max:'$price'},
        }
      },
      {
        $sort:{avgPrice:1}
      }
    ]);

    res.status(200).json({
      status:'sucess',
      data:{
        stats
      }
    })
});


///////////////// unwinding and projecting ////////////////////////
exports.getMonthlyPlan =catchAsync(async(req,res,next)=>{

    const year = req.params.year*1;
    const plan = await Tour.aggregate([
      {
        $unwind:'$startDates' // Here we are destructuring the dates into seperate document 
      },
      {
        $match:{ // by this mathcing function we are finding only the tours only in a sigle year 
          startDates:{// and we able of doing that becacuse of the startDates paresent in the tours as an array 
            $gte:new Date(`${year}-01-01`),
            $lte:new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group:{ // Here we are grouping them with the id = month that is present as an startDates in each document 
          _id:{$month:'$startDates'}, // here we are setting the Id = months
          numToursStarts:{$sum:1},// Here, by doing this we are summing total number of tours happing in that month
          tours:{$push:'$name'} // here by this, we are creating an array and pushing the name of the each tours to that array 
        }
      },
      {
        $addFields:{month:'$_id'}
      },
      // {
      //   $project:{
      //     _id:0
      //   }
      // },
      {
        $sort:{ // Now as we now this the method of sorting on the basis of the number tours present in the each month
          numToursStarts:-1
        }
      }
    ])

    res.status(200).json({
      status:'success',
      data:{
        plan
      }
    });
});

exports.getAllTours = factory.getAll(Tour);
exports.getTours = factory.getOne(Tour,{path:'reviews'});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);


// exports.getTours =catchAsync(async (req, res,next) => {
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     if(!tour){
//       return next(new AppError('No tour found with that Id',404));
//     }
//     res.status(200).json({
//       status:'sucess',
//       data:{
//         tour
//       }
//     })
// });


// exports.createTour = catchAsync(async (req, res,next)=>{
//   //old way of creating and tours is 
//   // const newTours = new Tour({});
//   // newTours.save();
//     const newTour =await Tour.create(req.body);
//     res.status(201).json({
//       status: 'sucess',
//       data:{
//         tour:newTour
//       }
//   });
// });
// exports.updateTour =catchAsync(async(req, res,next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
//       new:true,// this new method will help us to return the new updataed document to the client 
//       runValidators:true
//     });

//     if(!tour){
//       return next(new AppError('no tour found with that Id',404));
//     }

//     res.status(200).json({
//       status:'success',
//       data:{
//         tour
//       }
//     })

// });


  
// exports.deleteTour = catchAsync(async(req,res,next)=>{
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if(!tour){
//     return next(new AppError('No tour found with that id',404));
//   }

//   res.status(204).json({
//     status:'success',
//     data:null
//   });
// });