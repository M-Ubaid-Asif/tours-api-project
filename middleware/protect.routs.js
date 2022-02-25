const { decode } = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/app.errors");
const { verifyJwt } = require("../utils/jwt");

exports.protect = async function(req,res,next){
    
    // get token
    let token;
    // if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){

    // }
    if(req.headers.cookie){
        // console.log(req.headers.cookie)
        token = req.headers.cookie.split('=')[1]; 
    }
    console.log(token)
    if(!token){
        return next(new AppError('Your are not logged in! please login',401))
    }

    // verify token
    let decode;
    try {
        decode =await verifyJwt(token)
        console.log(decode)
        
    } catch (error) {
        return next(new AppError(error,401))
    }

    // check if user is still exists
    const user =await User.findById({_id:decode.id}).select('-password -__v')
    if(!user){
        return next(new AppError("you are no longer a user please sign up",401))
    }
    console.log('====>',user)

    // check if user changed passwordc
    console.log(user.changePasswordAfter(decode.iat))
    
    if(user.changePasswordAfter(decode.iat)){
        return next(new AppError('password has been changed please login again',401))
    }
    req.user = user;
    console.log(req.user)
    next();
}