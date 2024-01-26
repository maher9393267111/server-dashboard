const multer = require('multer');
const { randomBytes } = require("crypto");
// const AWS = require("aws-sdk");

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

const { S3Client, PutObjectCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');

const s3_v3 = new S3Client({
    endpoint: endpoint,
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});


function generateRandomHash() {
    const rawBytes = randomBytes(16);
    const hash = rawBytes.toString("hex");
    return hash;
  }


const uploadFile = async (filename, bucketname, folder, file, contentType) => {
    const key = folder ? `${folder}/${ generateRandomHash()}` :  generateRandomHash() ;


    const params = {
        Key: key,
        Bucket: 'dash93',
        Body: file,
        ContentType: contentType,
        ACL: 'public-read',
    };

    try {
        const command = new PutObjectCommand(params);
        await s3_v3.send(command);
        // encodeURIComponent //  `${cdnEndpoint}/${encodeURIComponent(key)}`;
        const url = `${cdnEndpoint}/${key}`;
        return url;
    } catch (err) {
        throw err;
    }
};

// list all folders in bucket
const listBuckets = async () => {
    const command = new ListBucketsCommand({});
    try {
        const data = await s3_v3.send(command);
        return data.Buckets;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    uploadFile,
    listBuckets,
};
