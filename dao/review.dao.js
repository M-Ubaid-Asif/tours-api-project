const Review = require("../models/reveiws.model")
const AppError = require("../utils/app.errors")

exports.createReviewDao=async(req)=>{
    try {
        const reviews =await Review.create({
            review:req.body.review,
            rating:req.body.rating,
            tour:req.body.tourid,
            user:req.body.userid
        })
        if(reviews){
            return reviews
        }else{
            throw new AppError('failed to review',401)
        }
    } catch (error) {
        throw new AppError('failed',401)
    }
}

exports.readReviewDao = async ()=>{
    try {
        const reveiws = await Review.find()
        console.log()
        console.log('====>',reveiws)
        if(reveiws){
            return reveiws
        }

    } catch (error) {
        throw new AppError(error,401)
    }
}