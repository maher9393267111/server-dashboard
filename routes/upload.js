
const express = require('express');
const multer = require('multer');
const router = express.Router();

const images = require('../controllers/digitaloceanUpload');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/avatar', upload.single('image'), images.sendAvatar); //FIXME REGEX


module.exports = router;