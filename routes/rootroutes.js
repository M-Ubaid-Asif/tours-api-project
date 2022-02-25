const { createBookingCheckout } = require('../controllers/booking.controller')
const { getoverview, gethome, bookedTour } = require('../controllers/rootcontroller')
const { protect } = require('../middleware/protect.routs')

const rootRouter = require('express').Router()



rootRouter.get('/',protect,createBookingCheckout,gethome)
rootRouter.get('/mybooked',protect,bookedTour)



module.exports = rootRouter
