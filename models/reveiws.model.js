const mongoose = require('mongoose')



const reviewSchema = mongoose.Schema({
    review:{
        type:String,
        required:[true,'review cannot be empty']
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"rating is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tours',
        required:[true,'Review must belongs to tour.']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must belongs to tour.']
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

reviewSchema.pre('find',function(next){
    this.populate({
        path:'user',
        select:'name photo -_id'
    }).populate({
        path:'tour',
        select:'tourFrom toTour -guides -_id'
    })
    next()
})

const Review = mongoose.model('Review',reviewSchema)



module.exports = Review