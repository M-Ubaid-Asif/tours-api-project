const express = require("express");
const app = express();
const cors = require("cors");
// const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const tourRouter = require("./routes/toursrouts");
// const { options } = require("./routes/toursrouts");
const errorHandler = require('./controllers/error.controller');
const userRouter = require("./routes/user.routes");
const AppError = require("./utils/app.errors");
const reviewRouter = require("./routes/review.routes");
const path = require('path');
const rootRouter = require("./routes/rootroutes");
const bookingRouter = require("./routes/booking.routes");


app.use(express.static(path.join(__dirname,'public')))
app.use('/img',express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser())
// app.use(bodyParser.raw());

// template engine
app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'))


// routes
app.use("/",rootRouter)
app.use("/tours", tourRouter);
app.use('/reviews',reviewRouter)
app.use('/user',userRouter)
app.use('/payment',bookingRouter)



app.get('/sign',(req,res,next)=>{
  res.render('signform',{title:"signin"})
})


app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //   status:"Fail",
    //   message:`can't find ${req.originalUrl}`
    // })
    next(new AppError(`can't find ${req.originalUrl} on this server`,404));
  })
app.use(errorHandler)

module.exports = app;
