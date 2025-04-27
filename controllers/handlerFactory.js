const { Model } = require("mongoose");
const AppError = require("../util/appError");
const catchAsync = require("../util/catchAsync");
const APIFeatures = require('../util/apiFeatures');

exports.deleteOne = Model =>catchAsync(async(req,res,next) =>{
const doc = await Model.findByIdAndDelete(req.params.id);
if(!doc){
    return next(new AppError('No document found with thiat id',404))
}
res.status(204).json({
    status:'success',
    data:null
});
});

exports.updateOne = Model=> catchAsync(async(req, res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body,{
      new:true,// this new method will help us to return the new updataed document to the client 
      runValidators:true
    });

    if(!doc){
        return next(new AppError('No document found  with that Id',404))
    }

    res.status(200).json({
      status:'success',
      data:{
        data:doc
      }
    })

});


exports.createOne = Model =>catchAsync(async(req,res,next)=>{
    const doc = await Model.create(req.body);

    res.status(201).json({
        status:'success',
        data:{
            data:doc
        }
    })
})

exports.getOne = (Model,popOptions) =>
    catchAsync(async (req, res,next) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    const doc = await query;

    if(!doc){
      return next(new AppError('No tour found with that Id',404));
    }
    res.status(200).json({
      status:'sucess',
      data:{
        data:doc
      }
    })
});


exports.getAll = Model => catchAsync(async (req, res,next) => {
    //To allow for nested GET reviews  on tour(hack)
    let filter = {};
    if(req.params.tourId)filter = {tour:req.params.tourId};
    
  const features = new APIFeatures(Model.find(filter),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const tours = await query;
  const doc = await features.query;

  //SEND THE RESPONSE
  res.status(200).json({
      status: 'sucess',
      result:Model.length,
      data:{
        doc
      }
    });
});