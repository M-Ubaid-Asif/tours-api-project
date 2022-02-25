const Tours = require("../models/toursmodel");
const AppError = require("../utils/app.errors");

exports.createToursDao = async (req, res) => {
  try {
    if (req.body) {
      // console.log("hey");
      const coverImage = req.files.coverImage[0].filename
      const images = req.files.images.map((ele)=>{
        return ele.filename
      })
      console.log('==images====>',images)
      const tourFrom = req.body.tourFrom;
      const toTour = req.body.toTour;
      const date = req.body.date;
      const groupSize = req.body.groupSize;
      const guides = req.body.guides
      const price = req.body.price
      
      // const locations = req.guides.locations
      // const startLocation = req.guides.startLocation
      console.log("haha price",price);
      const data = await Tours.create({
        tourFrom,
        toTour,
        images,
        date,
        groupSize,
        guides,
        price,
        coverImage
      });
      console.log(data.price);
      if (data) {
        return data;
      }
    }
  } catch (error) {
    res.status(401).json({
      message: "failed",
      error,
    });
  }
};

exports.readToursDao = async (req, res) => {
  try {
    const data = await Tours.find()
    console.log('------>',data)
    return data;
  } catch (error) {
    res.status(401).json({
      message: "failed",
      error,
    });
  }
};

// update

exports.updateDao = async (req, res) => {
  try {
    const _id = req.params.id;
    console.log(_id);
    const data = await Tours.findByIdAndUpdate({ _id }, req.body);
    if (data) {
      return data;
    } else if (!data) {
      res.status(401).json({
        message: "failed to update",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Failed",
      error,
    });
  }
};

exports.deletedao = async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await Tours.findByIdAndDelete({ _id });
    if (data) {
      return data;
    }
  } catch (error) {
    res.status(401).json({
      message: "Failed",
      error,
    });
  }
};

exports.calAvgSizedao = async (req, res) => {
  try {
    const data = await Tours.aggregate([
      {
        $match: { groupSize: { $gte: 1 } },
      },
      {
        $group: {
          _id: { $toUpper: `$toTour` },
          avgGroupSize: { $avg: `$groupSize` },
          minGroupSize: { $min: `$groupSize` },
          totalSize: { $sum: `$groupSize` },
          totaltours: { $sum: 1 },
        },
      },
      {
        $sort: { totalSize: 1 },
      },
      {
        $match: { avgGroupSize: { $ne: 5 } },
      },
      {
        $addFields: { months: 2 },
      },
    ]);
    if (data) {
      return data;
    }
  } catch (error) {
    res.status(401).json({
      message: "Failed",
      error,
    });
  }
};
