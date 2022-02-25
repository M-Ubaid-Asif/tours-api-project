const User = require("../models/user.model")
const { signJwt } = require("../utils/jwt")
const bcrypt = require('bcrypt')
const AppError = require("../utils/app.errors")

exports.createUserDao = async(req)=>{
    try {
        console.log('dao is working')
        if(req.file){
            req.body.photo = req.file.filename
        }
        if(req.body){
            if(req.body.password != req.body.confirmPassword){
                console.log('password is not matching')
                return null
            }
            // const name = req.body.name
            // const email = req.body.email
            // let password = req.body.password
            // const confirmPassword = req.body.confirmPassword
            // const photo = req.body.photo
            const user =await User.create({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                photo:req.body.photo
            })
            console.log('---->',user)
            if(user){
                const token = await signJwt(user._id)
                console.log('===>',token)
    
                return token
            }else{
                throw new AppError('failed to create',401)
            }
        }

    } catch (error) {
        throw new AppError('failed to create',401)
    }
}


exports.getUserDao = async(req)=>{
    try {
        console.log('dao is working')
        if(req.body){
            if(!(req.body.password && req.body.email)){
                console.log('password is not matching')
                return null
            }
            // console.log(req.body)
            // const name = req.body.name
            // const email = req.body.email
            // let password = req.body.password
            // const confirmPassword = req.body.confirmPassword
            // const photo = req.body.photo
            const user =await User.findOne({
                email:req.body.email
            })
            
            console.log('------------>us')
            if(user){
                // const isvalid = await bcrypt.compare(req.body.password,user.password)
                const isvalid =await user.correctPassword(req.body.password,user.password)
                console.log(isvalid)
                if(isvalid){
                    const token = await signJwt(user._id)
                    console.log('===>',token)
        
                    return token
                }else{
                    throw new AppError('password is not matching',401)
                }
            }else if(!user){
                throw new AppError('failed to login')
            }

        }

    } catch (error) {
        throw new Error(error)
    }
}