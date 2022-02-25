const mongoose = require("mongoose");
const User = require("./user.model");

const tourSchema = mongoose.Schema({
  tourFrom: {
    type: String,
    required: [true, "tourFrom must be required"],
    trim: true,
  },
  toTour: {
    type: String,
    required: [true, "toTour must be required"],
    trim: true,
  },
  date: {
    type: String,
  },
  startLocation:{
    // geo json
    type:{
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinates:[Number],
      address:String,
      description:String
    }
  },
  price:{
    type: Number,
    required:[true,`tour must hava a price`],
  }
  ,
  groupSize: {
    type: Number,
    required: true,
  },
  coverImage:{
    type:String,
    required:[true,"A Tour must have a cover image"]
  },
  images:[String]
  ,
  locations:[
    {

      type:{
        type:{
          type:String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    }
  ],
  guides:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'User'
    }
  ]
});


tourSchema.pre('find',function(next){
  this.populate({
    path:'guides',
    select:'-__v -password -passwordChangedAt'
  })
  next()
})
tourSchema.pre('save', async function(next){
  console.log('calling',this.guides)
  const guidesPromises = this.guides.map(async id=>{
    console.log('---->ids',id)
    return await User.findById(id,{name:1,email:1,photo:1});

  } )
  console.log('calling again',guidesPromises)
  this.guides = await Promise.all(guidesPromises)
  console.log('calling again and again')
  next()
})



const Tours = mongoose.model("Tours", tourSchema);

module.exports = Tours;
