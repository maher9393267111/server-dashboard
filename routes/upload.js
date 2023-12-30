const express = require("express");
const router = express.Router();

const {
  uploadProductImage,
  uploadCategoryImage,
  uploadSliderImage,
  uploadSupplierImage,
} = require("../controllers/upload");

router.post("/category/:id", uploadCategoryImage);
router.post("/slider/:id", uploadSliderImage);
router.post("/supplier/:id", uploadSupplierImage);
router.post("/product/:id", uploadProductImage);

module.exports = router;
