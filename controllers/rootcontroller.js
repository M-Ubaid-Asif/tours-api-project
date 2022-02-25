const Booking = require("../models/booking.model")
const Tours = require("../models/toursmodel")

exports.gethome =(req,res,next)=>{
    res.render('home',{name:req.user.name,photo:req.user.photo,title:"home",user:req.user})
}


exports.getoverview = (req,res,next)=>{
    res.render('overview',{name:"asif",age:21,title:"overviews",user:req.user})
}


// exports.gettours =async (req,res,next)=>{
//     const tours = await Tours.find()
//     res.render('tours',{name:"zaid",age:21,title:"Tours",tours})
// }

exports.bookedTour = async(req,res,next)=>{
    try {
        console.log('boookingg',req.user._id)
        const booking = await Booking.find({user:req.user._id})
        console.log(booking)
        // find tour with the returned ids
        const tourIDs = booking.map(ele =>ele.tour)
        const tours = await Tours.find({_id:{$in:tourIDs}});

        res.status(200).render('overview',{
            title:"my tours",
            tours,
            user:req.user
        })

    } catch (error) {
        
    }
}