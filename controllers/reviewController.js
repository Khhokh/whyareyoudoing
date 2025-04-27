const Review = require('../models/reviewModle');
const catchAsync = require('../util/catchAsync');
const factory = require('./handlerFactory');

// exports.getAllReviews = catchAsync(async(req,res,next) =>{
//     let filter = {};
//     if(req.params.tourId)filter = {tour:req.params.tourId};
    
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status:'sucess',
//         result:reviews.length,
//         data:{
//             reviews
//         }
//     });
// });

///Middle that we are going to replace this 
/*    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id; */

exports.setTourUserIds = (req,res,next) =>{
    //Allow nested routes 
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}


// exports.createReview = catchAsync(async(req,res,next)=>{
//     //Allow nested routes
//     if(!req.body.tour) req.body.tour = req.params.tourId;
//     if(!req.body.user) req.body.user = req.user.id;
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status:'sucess',
//         data:{
//             review:newReview
//         }
//     })
// })
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview =factory.updateOne(Review);
exports.deleteReview =factory.deleteOne(Review);