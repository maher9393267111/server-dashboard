const express = require("express");
const router = express.Router();

const {
  getAllSlider,
  createSlider,
  updateSlider,
  deleteSlider,
} = require("../controllers/sliders");

router.get("/", getAllSlider);
router.post("/", createSlider);
router.put("/:id", updateSlider);
router.delete("/:id", deleteSlider);

module.exports = router;
