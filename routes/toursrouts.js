
const {
  readTours,
  createTour,
  updateTour,
  deleteTour,
  calAvgSize,
  uploadToursImage,
} = require("../controllers/tourscontrollers");
const { protect } = require("../middleware/protect.routs");

const AppError = require('../utils/app.errors')
const router = require("express").Router();

router.post("/",protect,uploadToursImage,createTour);
router.get("/",protect,readTours);
router.get("/avggrpsize",protect, calAvgSize);
router.patch("/:id",protect,updateTour);
router.delete("/:id",protect,deleteTour);





module.exports = router;
