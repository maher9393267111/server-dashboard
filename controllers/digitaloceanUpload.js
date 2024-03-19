require('dotenv').config();
const crypto = require('crypto');
// const multer = require('multer');
const sharp = require('sharp');
const {
    S3Client,
    ListBucketsCommand,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { isNullOrUndefined } = require('util');

const bucketName = 'acabucket';
const region = 'us-east-1';
const accessKeyId = 'DO00XPGN8Q86MN438NN3';
const secretAccessKey = 'VNM2xYl0Yu4o/BLeJWq/r26hgH0omZQ08z7ROlVZizc';


const endpoint = 'https://nyc3.digitaloceanspaces.com';
const cdnEndpoint = 'https://acabucket.nyc3.digitaloceanspaces.com';









const s3Client = new S3Client({
    endpoint: endpoint,
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

exports.sendAvatar = async (req, res) => {
    try {
        const file = req.file;
        console.log('file', file);

      //  res.status(201).json({ meeeage: 'hello' });

        // const file = req.file;
        // console.log(file);
        // const oldfile = req.query.oldfile ?? null;

        // if (oldfile) {
        //   await s3.send(
        //     new DeleteObjectCommand({
        //       Bucket: "dash93",
        //       Key: oldfile,
        //     })
        //   );

        //   console.log("old file Deleted successfully  🌐🌐 🌐🌐")

        // }

        const fileBuffer = await sharp(file.buffer).resize({ height: 500, width: 500, fit: 'cover' }).toBuffer();

        const fileName = crypto.randomBytes(32).toString('hex');
        const params = {
            Bucket: bucketName,
            Body: fileBuffer,
            Key: `hamad/${fileName}`,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        var result = await s3Client.send(new PutObjectCommand(params));
        return res.status(201).json({ filename: fileName,  link: `${cdnEndpoint}/hamad/${fileName}` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
};

exports.DeleteImage = async (req, res) => {
    try {
        const { filename, folder = null } = req.body;

        
        console.log('fileName🧱⬇️↖️🔝🔙⚛🕎🧱⬇️↖️🔝🔙⚛🕎🧱⬇️↖️🔝🔙⚛🕎', filename ,'fo;der' ,folder);
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: `${folder === null ? 'hamad' : folder}/${filename}`,
            }),
        );

        return res.status(201).json({ message: 'ok' ,filename ,folder });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
};





exports.uploadMulti = async (req, res) => {
    try {
        const files = req.files;
        console.log('file', files);

        const images = [];

        //  files.forEach(async(file) => {
        for (const file of files) {
            console.log('FILEEE', file);

            const fileBuffer = await sharp(file.buffer).resize({ height: 500, width: 500, fit: 'cover' }).toBuffer();

            const fileName = crypto.randomBytes(32).toString('hex');
            const params = {
                Bucket: bucketName,
                Body: fileBuffer,
                Key: `hamad/${fileName}`,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };

            var result = await s3Client.send(new PutObjectCommand(params));

            images.push({ filename: fileName, link: `${cdnEndpoint}/hamad/${fileName}` });
        }

        console.log('IMAGES', images);

        return res.status(201).json({ images });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
};
