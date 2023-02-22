const AppError = require("../utils/app.errors")

const handleCastErrordb = err=>{
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message,400);
}




const sendErrorDevelopment = (err,res)=>{
  res.status(err.statusCode).json({
    status:err.status,
    message:err.message,
    stack:err.stack
  })  
}

const sendErrorProduction = (err,res)=>{
  // operational trusted error
  if(err.isOperational){
    res.status(err.statusCode).json({
      status:err.status,
      message:err.message
    })

    // programming or other unknown error
  }else{
    // 1)log error
    console.error("ERROR",err)


    //send generic message 
    res.status(500).json({
      status:'Error',
      message:"somthing went wrong!"
    })
  }
}





module.exports = (err,req,res,next)=>{
    console.log(err.stack)
    err.statusCode = err.statusCode ||500 ;
    err.status = err.status || 'error';
    err.status===true?err.status='fail':err.status

  if(process.env.NODE_ENV ==='development'){
    // res.status(err.statusCode).json({
    //   status:err.status,
    //   message:err.message,
    //   stack:err.stack
    // })
    sendErrorDevelopment(err,res)
  }else if(process.env.NODE_ENV ==='production'){
    let error = {...err}
    if(error.name === 'CastError') error = handleCastErrordb(error)
    sendErrorProduction(error,res)
  }

  }