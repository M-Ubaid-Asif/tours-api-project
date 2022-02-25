const jwt = require('jsonwebtoken')
const AppError = require('./app.errors')




exports.signJwt=async(payload)=>{
    try {
        console.log('token part')
        const token = jwt.sign({id:payload},'abcdefg',{
            expiresIn:'10d'
        })
        console.log('=====>',token)
        if(token){
            return token  

        }        
    } catch (error) {
        AppError('failed to sign jwt',401)
    }
}


exports.verifyJwt=async(payload)=>{
    return await jwt.verify(payload,'abcdefg')
}