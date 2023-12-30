const Slider = require("../models/slider");
const tryCatch = require("./utils/tryCatch");

const getAllSlider = tryCatch(async (req, res) => {
  const sliders = await Slider.find();
  res.status(200).json(sliders);
});

const createSlider = tryCatch(async (req, res) => {
  const data = req.body;
  const slider = new Slider(data);
  await slider.save();
  res.status(200).json(slider);
});

const updateSlider = tryCatch(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const slider = await Slider.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json(slider);
});

const deleteSlider = tryCatch(async (req, res) => {
  const { id } = req.params;
  const slider = await Slider.findByIdAndDelete(id);
  res.status(200).json(slider);
});

module.exports = { getAllSlider, createSlider, updateSlider, deleteSlider };
