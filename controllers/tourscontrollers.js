const {
  createToursDao,
  readToursDao,
  updateDao,
  deletedao,
  calAvgSizedao,
} = require("../dao/toursdao");
const moment = require("moment");
const AppError = require("../utils/app.errors");
const multer = require('multer');
const sharp = require('sharp');
const path = require('path')
const fs = require('fs')
const storage = multer.diskStorage({
  destination:"public/img/",
  filename:function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+'-'+file.originalname);
  }
})

const checkFile = (req,file,cb)=>{
  const fileType = /jpeg|jpg|png/
  const extname = fileType.test(path.extname(file.originalname))

  const mimetype = fileType.test(file.mimetype)

  if(extname && mimetype){
    cb(null,true)
  }else{
    cb(new AppError("file shold be type of image eg. jpeg,jpg,png",401),false)
  }

}

const upload = multer({
  storage:storage,
  fileFilter:checkFile
});

exports.uploadToursImage = upload.fields([
  {name:"coverImage",maxCount:1},
  {name:"images",maxCount:3}
])

exports.createTour = async (req, res) => {
  try {
    // console.log(req.files)
    
    // ============================== resizing images ================================
    const coverImage = req.files.coverImage[0]
    const images = req.files.images
    console.log(coverImage.path)
    sharp(coverImage.path).resize(500,500).toFile(path.resolve(coverImage.destination,"toursImages",coverImage.filename),
    (err)=>{
      if(err){
        console.log(err)
      }else{
        fs.unlink(coverImage.path,(err)=>console.error(err))
      }
    })

    images.forEach(ele => {
      sharp(ele.path).resize(500,500).toFile(path.resolve(ele.destination,'toursImages',ele.filename),
      (err)=>{
        if(err){
          console.log(err)
        }else{
          fs.unlink(ele.path,(err)=>console.log(err))
        }
      }
      )
    });



    const data = await createToursDao(req, res);
    if (data) {
      res.status(200).json({
        message: "Success",
        data,
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "failed",
      error,
    });
  }
};

exports.readTours = async (req, res) => {
  try {
    const data = await readToursDao(req, res);
    if (data) {
      // res.status(200).json({
      //   author: "ubaid",
      //   date: moment().format("DD MMM YYYY, h:mm:ss a"),
      //   data,
      // });
      res.render("tours",{tours:data,user:req.user})
    }
  } catch (error) {
    res.status(401).json({
      message: "failed",
      error,
    });
  }
};

exports.updateTour = async (req, res,next) => {
  try {
    console.log('controller fromupdte')
    data = await updateDao(req, res);
    if (data) {
      res.status(200).json({
        message: "updated successfully",
      });
    }
  } catch (error) {
    // res.status(401).json({
    //   message: "failed",
    //   error,
    // });
    next(new AppError('_id is required in params',404))
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const data = await deletedao(req, res);
    if (data) {
      res.status(200).json({
        message: "successfully deleted!",
        deletedRecord: data,
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Failed",
      error,
    });
  }
};

exports.calAvgSize = async (req, res) => {
  try {
    const data = await calAvgSizedao(req, res);
    if (data) {
      res.status(200).json({
        message: "success",
        averageGroupSize: data,
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Failed",
      error,
    });
  }
};
