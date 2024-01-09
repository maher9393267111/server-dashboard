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

// prepare S3 client
const bucketName = 'dash93';
const region = 'us-east-1';
const accessKeyId = 'DO00M9XA6DJ9P9Y4UWFT';
const secretAccessKey = 'fcWJxA4nn0r5yNKUi1011UzQ66FPMO6Lt8UEuGWSypE';

// AWS_BUCKET_NAME = dash93
// AWS_BUCKET_REGION =us-east-1

// AWS_ACCESS_KEY =DO00M9XA6DJ9P9Y4UWFT
// AWS_SECRET_ACCESS_KEY =fcWJxA4nn0r5yNKUi1011UzQ66FPMO6Lt8UEuGWSypE

const endpoint = 'https://nyc3.digitaloceanspaces.com';
const cdnEndpoint = 'https://dash93.nyc3.cdn.digitaloceanspaces.com';

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
        const files = req.file;
        console.log('file', files);

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
        return res.status(201).json({ filename: fileName, link: `${cdnEndpoint}/${fileName}` });
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
                Bucket: 'dash93',
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
