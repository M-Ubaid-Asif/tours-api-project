const { forgotPassword, resetPassword } = require('../controllers/auth.controller')
const { signUp, login, imageupload } = require('../controllers/user.controller')

const userRouter = require('express').Router()



// ===> image upload
// const storage = multer.diskStorage({
//     destination:'public/img/',
//     filename:function(req,file,cb){
//       cb(null,file.fieldname+'-'+file.originalname.split('.')[0]+'-'+Date.now()+path.extname(file.originalname));
//     }
//   })
  
//   const checkFileType = (file,cb)=>{
//     // allowed file extension using regular expression
//     console.log('hey')
//     const fileType= /jpeg|jpg|png/;
  
//     const extname = fileType.test(path.extname(file.originalname).toLowerCase())
  
//     const mimetype = fileType.test(file.mimetype)
  
//     if(extname && mimetype){
//       cb(null,true)
//     }else{
//       cb("Error:file should be type of image eg:jpg,jpeg,png")
//     }
  
//   }
  
//   const upload = multer({
//     storage:storage,
//     limits:{fileSize:150000},
//     fileFilter:function(req,file,cb){
//         console.log('filefilter')
//       checkFileType(file,cb)
//     }
//   }).single('profile')
  
  

userRouter.post('/signup',imageupload,signUp)
// userRouter.post('/signup',(req,res)=>{
//     upload(req,res,(err)=>{
//         console.log('hello')
//         if(err){
//             console.log('error')
//             res.render('signform',{
//                 msg:err
//             });
//         }else{
//             if(req.file===undefined){
//                 res.render('signform',{
//                     msg:"please select the file!"
//                 })
//             }else{
//                 res.render('home',{
//                     msg:"file uploaded",
//                     file:`img/${req.file.filename}`
//                 })
//             }

//         }
//     })
//     // console.log(req.body)
// })

userRouter.post('/login',login)
userRouter.post('/forgotPassword',forgotPassword)
userRouter.post('/resetPassword/:token',resetPassword)

module.exports = userRouter