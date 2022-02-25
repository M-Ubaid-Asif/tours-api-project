const User = require("../models/user.model");
const AppError = require("../utils/app.errors");
const sendEmail = require("../utils/email");
const crypto = require('crypto');
const { signJwt } = require("../utils/jwt");
exports.forgotPassword = async(req,res,next)=>{
    // get user email
    const user = await User.findOne({email:req.body.email});
    console.log('found user',user)
    if(!user){
        return next(new AppError('there is no user with this email',401))
    }
    // genrate a random reset token 
    const resetToken =await user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});

    console.log('token is created ',resetToken)
    // send it to users emai
    const resetUrl = `${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`
    
    const message = `Forget your password? Submit a patch request with your new password and confirm password to :${resetUrl}\n if you didnt forget your password , please ignore this email`

    try {
        console.log('trying to send token')
        await sendEmail({email:user.email,subject:'your password is only valid for 10 min',message})
    
        res.status(200).json({
            status:'success',
            message:'token sent to email!'
        });
        
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpired=undefined;
        await user.save({validateBeforeSave:false});

        return next(new AppError('there was an error for sending an email',500))
    }
}


exports.resetPassword =async(req,res,next)=>{
    // get user based on token
    console.log(req.params.token)
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({passwordResetToken:hashToken,passwordResetExpired:{$gt:Date.now()}});


    // if token has not expired , and there is user,set the new password
    if(!user){
        return next(new AppError('token is invalid or has expired',400))
    }
    if(req.body.password === req.body.confirmPassword){
        user.password = req.body.password
        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;
        await user.save()
    }
    // update changePasswordAt property for the user 

    const token = await signJwt(user._id);
    res.status(200).json({
        status:'Success',
        token
    });
    

}