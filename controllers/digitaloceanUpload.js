

require('dotenv').config();
const crypto = require('crypto');
// const multer = require('multer');
const sharp = require('sharp');
const { S3Client, ListBucketsCommand, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');








// prepare S3 client
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const endpoint ="https://nyc3.digitaloceanspaces.com"
const cdnEndpoint ="https://dash93.nyc3.cdn.digitaloceanspaces.com"

const s3Client = new S3Client({
  endpoint: endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});









exports.sendAvatar = async (req, res) => {

  try {
  const file = req.file;

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 500, width: 500, fit: "cover" })
    .toBuffer();

  const fileName = crypto.randomBytes(32).toString('hex');
  const params = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: file.mimetype ,
    ACL: 'public-read'
  }

    var result = await s3Client.send(new PutObjectCommand(params));
    return res.status(201).json({ fileName: fileName ,imageUrl:`${cdnEndpoint}/${fileName}` });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Image failed to send to S3" });
  }
}