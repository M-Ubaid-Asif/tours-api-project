const { createReviewDao, readReviewDao } = require("../dao/review.dao")
const AppError = require("../utils/app.errors")
const moment = require('moment')
exports.reviewController =async (req,res,next)=>{
    try {
        const review = await createReviewDao(req)
        if(review){
            res.status(200).json({
                date:moment().format('DD MMM YYY, h:mm:ss a'),
                data:review
            })
        }
    } catch (error) {
        return next(new AppError(error,401))
    }
}


exports.readReviewController = async (req,res,next)=>{
    try {
        console.log('i am review controller')
        const reviews = await readReviewDao()
        if(reviews){
            res.status(200).json({
                subject:"Reviews",
                Date:moment().format('DD MMM YYY, h:mm:ss a'),
                data:reviews
            })
        }
    } catch (error) {
        res.status(401).json({
            message:'failed',
            error
        })
    }
}