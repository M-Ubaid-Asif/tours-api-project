const mongoose = require('mongoose')



const bookingSchema = new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tours',
        required:[true,'booking must belongs to tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,'booking must belongs to user']
    },
    price:{
        type:Number,
        required:[true,'booking must have a price']
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    paid:{
        type:Boolean,
        default:true
    }

})

bookingSchema.pre(/^find/,function(next){
    this.populate({
        path:'tour',
        select:'toTour'
    })
    next()
})


const  Booking = mongoose.model("Booking",bookingSchema)


module.exports = Booking