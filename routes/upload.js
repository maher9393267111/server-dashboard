
const express = require('express');
const multer = require('multer');
const router = express.Router();

const images = require('../controllers/digitaloceanUpload');
const audioService = require("../helpers/audioService");
const {   uploadFile}  = require('../helpers/aws')

const validFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "text/csv",
    "text/plain",
    "application/pdf",
    "application/mspowerpoint",
    "application/msword",
    "application/excel",
    "audio/mpeg",
    "audio/mp4",
    "audio/mp3",
    "audio/ogg",
    "audio/vnd.wav",
    "audio/wave",
    "video/mp4",
    "video/3gpp",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/x-flv",
    "web3",
    "webm"

  ];



const storage = multer.memoryStorage();

const upload = multer({ storage,
    // fileFilter: (req, file, cb) => {
    //   if (validFileTypes.includes(file.mimetype)) {
    //     cb(null, true);
    //   } else {
    //     cb(new Error("Invalid file type."));
    //   }


    // }, 
  
  });


router.post('/avatar', upload.single('image'), images.sendAvatar); //FIXME REGEX
router.post('/deleteimage', images.DeleteImage);


// upload multiimages
router.post('/uploadmulti',upload.array('images'), images.uploadMulti);


router.post("/uploadaudio", upload.single("audiofile"), async (req, res) => {
    try {
      const filename = req.file.originalname;
      const file = req.file.buffer;
      const contentType = req.file.mimetype;
      const bucketname ='dash93'
      const folder= 'audio'

  console.log("fileTYPEEEEE📕💡📕💡" , contentType)


      const link = await uploadFile(filename, bucketname, folder, file, contentType)
      // await audioService.uploadAudio(filename, file, contentType);
      console.log({ status: "success", link });
      res.send({ status: "success", link });
    } catch (error) {
      console.log("Error uploading file:", error);
      res.status(500).send({ status: "error" });
    }
  });








module.exports = router;