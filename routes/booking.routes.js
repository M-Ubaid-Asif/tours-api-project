const express = require('express');
const { getCheckoutSession, bookedTour } = require('../controllers/booking.controller');
const { protect } = require('../middleware/protect.routs');

const bookingRouter = express.Router();

bookingRouter.get('/checkout-session/:tourid',protect,getCheckoutSession)



module.exports = bookingRouter