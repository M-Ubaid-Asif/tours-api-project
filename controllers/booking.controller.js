const stripe = require('stripe')(process.env.STRIPE_KEY)
const Booking = require('../models/booking.model')
const Tours = require("../models/toursmodel")
const AppError = require('../utils/app.errors')

exports.getCheckoutSession =async (req,res,next)=>{
    try {
        // get current booked tour
        const tour = await Tours.findById(req.params.tourid)
        
        // create checkout session
        const session =await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourid}&user=${req.user.id}&price=${tour.price}`,
            cancel_url:`${req.protocol}://${req.get('host')}/tours`,
            customer_email:req.user.email,
            client_reference_id:req.params.tourid,
            line_items:[
                {
                    name:`${tour.toTour} Tour`,
                    description:`${tour.tourFrom} To ${tour.toTour}`,
                    images:[`https://upload.wikimedia.org/wikipedia/commons/7/70/Neeulm_Valley_AJK_%28Arang_Kel%29.jpg`],
                    amount:tour.price *100,
                    currency:'inr',
                    quantity:1
                    
                }
            ]
        })
    
        // create session as response for client
        res.status(200).json({
            status:"success",
            session
        })
    } catch (error) {
        console.log('erro')
        next(new AppError(error,401))
    }
}


exports.createBookingCheckout =async (req,res,next)=>{
    const {tour,user,price}=req.query
    console.log(price)
    if(!tour && !price && !user){
        return next()
    }
    await Booking.create({tour,price,user})

    res.redirect(req.originalUrl.split('?')[0])
}




