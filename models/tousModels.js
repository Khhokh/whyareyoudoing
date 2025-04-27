const mongoose = require('mongoose')
// const User = require('./../models/userModel');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters']
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // this only points to current doc on NEW document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation:{
    //GeoJson
    type:{
      type:String,
      default:'Point',
      enum:['Point']
    },
    coordinate:[Number],
    address:String,
    description:String
  },
  locations :[
    {
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinate:[Number],
      address:String,
      description:String,
      day:Number
    }
  ],

  guides:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'User'
    }
  ]
},
///this is for the virtual property, to add in the last of the rendered document ///////
{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

tourSchema.pre('save', function(next){
  this.slug = slugify(this.name,{lower:true}); // this slugify will add a new slugify name  to the document and that name will be in lowercase 
  next();
})


////////////////////////// virtual property ///////
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7 ;
})

//Virtual populate 
tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'tour',
  localField:'_id'
})

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//////// Query middleWare ////////////////////////////
tourSchema.pre(/^find/, function(next){
  this.find({secretTour:{$ne:true}});
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/,function(next){
  this.populate({
    path:'guides',
    select:'-__v -passwordChangedAt'
  });
  next();
})


tourSchema.post(/^find/,function(doc,next){
  console.log(`query took ${Date.now()-this.start}milliseconds!;`);
  next();
})

/////// Aggregation middleware /////////////////////
tourSchema.pre('aggregate',function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
  console.log(this.pipeline());
  next();
})

const Tours = mongoose.model('Doctor',tourSchema); // this part handle the where to put the data inside the data base of the atlas and also 
// add the by its self 's' to the collection name example here 'Tour' we are giving  but mongoose automatically make it 'Tours'
module.exports=Tours;
