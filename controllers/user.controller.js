const { createUserDao, getUserDao } = require("../dao/user.dao")
const multer = require('multer')
const path = require('path')
const AppError = require("../utils/app.errors")
const sharp = require("sharp")
const fs = require('fs')
const storage = multer.diskStorage({
    destination:'public/img/',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+file.originalname.split('.')[0]+path.extname(file.originalname))
    }
})
// const storage = multer.memoryStorage()

const checkFile = (req,file,cb)=>{
    const fileType = /jpeg|jpg|png/
    const extname = fileType.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileType.test(file.mimetype);
    if(extname && mimetype){
        cb(null,true)
    }else{
        cb(new AppError("Error:file should be type of image eg:jpg,jpeg,png",400),false)
    }

}

const upload = multer(
    {
        storage:storage,
        fileFilter:checkFile
    }
    )

exports.imageupload=upload.single('photo')



// exports.resizeImage= (req,res,next)=>{
//     if(!req.file) return next();
//     req.file.filename = `${req.user._id}-${Date.now()}.jpeg`

//     sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/${req.file.filename}`);

// }

exports.signUp=async(req,res)=>{
    try {
        console.log(req.file)
        console.log(req.body)

        const { filename: profile } = req.file;
        console.log('===>img',profile,'===>',req.file.path)
        console.log(path.resolve(req.file.destination,profile))
        sharp(req.file.path).resize(500, 500).toFile(path.resolve(req.file.destination, 'users', profile), (err) => {
            if (!err) {
                fs.unlinkSync(req.file.path)
            } else {
                console.log(err)
            }
        })
         
         console.log('hahah')
         console.log('sharp')

        const token = await createUserDao(req)
        if(token === null){
            res.status(401).json({
                status:'failed',
                error:"password and confirm password is not matching"
            })
        }
        else if(token){
            
            res.cookie('accessToken',token,{
                path:"/"
            })
            res.redirect('/')
        }

    } catch (error) {
        res.status(401).json({
            status:"faild",
            error
        })
    }
}




exports.login=async(req,res)=>{
    try {
        console.log('--->hjey')
        const token = await getUserDao(req)
        console.log('controller token',token)
        if(token === null){
            res.status(401).json({
                status:'failed',
                error:"password and email is required"
            })
        }
        else if(token){
            console.log('hey')
            
            res.cookie('accessToken',token,{
                path:"/"
            })
            res.status(200).json({
                status:"success",
                token
            })
        }

    } catch (error) {
        res.status(401).json({
            status:"faild to login email or password is incorrect",
        })
    }
}