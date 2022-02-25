const { reviewController, readReviewController } = require('../controllers/review.controller')
const { protect } = require('../middleware/protect.routs')

const reviewRouter = require('express').Router()



reviewRouter.post('/',protect,reviewController)
reviewRouter.get('/',protect,readReviewController)


module.exports = reviewRouter