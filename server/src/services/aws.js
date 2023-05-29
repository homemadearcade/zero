import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
const { getSignedUrl} = require("@aws-sdk/s3-request-presigner");
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import dotenv from 'dotenv'; // Loading dotenv to have access to env variables
dotenv.config()
import multer from 'multer';
import multerS3 from 'multer-s3';
import S3ImageUpload from '../models/S3ImageUpload';

// Configuring AWS
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_KEY, // stored in the .env file
    secretAccessKey: process.env.S3_SECRET, // stored in the .env file
  },
  region: process.env.BUCKET_REGION // This refers to your bucket configuration.
});

// Retrieving the bucket name from env variable
const Bucket = process.env.BUCKET_NAME;

export const s3Multer = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const { Key, ContentType } =  req.query;
      cb(null, Key)
    }
  })
}).single('imageFile');

export const recordS3Upload = async function(req, res, next) {
  try {
    const { Key, ContentType } =  req.query;
    // Key refers to the remote name of the file.

    console.log('upload size', req.file.size)

    let s3ImageUpload = await S3ImageUpload.create({
      data: {
        Key,
        ContentType,
        fieldname: req.file.fieldname,
        bucket: process.env.BUCKET_NAME,
        bucketRegion: process.env.BUCKET_REGION
      }
    });

    console.log('s3 upload success', Key)
    next()
  } catch(e) {
    console.log('s3 upload error', e)
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

// GET URL Generator
export function generateGetUrl(Key) {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket,
      Key,
    };

    const command = new GetObjectCommand(params);

    // Note operation in this case is getObject
    try {
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      resolve(url);
    } catch(err) {
      console.log('ERROR', err)
      reject(err);
    }

  });
}

// PUT URL Generator
// export function generatePutUrl(Key) {
//   return new Promise(async (resolve, reject) => {
//     const params = {
//       Body: Key,
//       Bucket,
//       Key,
//       ContentType: 'image/png',
//     };

//     const command = new PutObjectCommand(params);

//     // Note operation in this case is getObject
//     try {
//       const unhoistableHeaders = new Set([ 'x-amz-content-sha256', 'x-amz-algorithm', 'X-Amz-Credential', 'X-Amz-Date', 'X-Amz-Expires', 'X-Amz-Signature']);
//       const url = await getSignedUrl(s3, command, { expiresIn: 3600,  unhoistableHeaders });
//       resolve(url);
//     } catch(err) {
//       console.log('ERROR', err)
//       reject(err);
//     }

//   });
// }


export async function generatePutUrl(Key) {
  return new Promise(async (resolve, reject) => {

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_presigned_post.html

    const Conditions = [
      // { acl: "public-read" },
      { bucket: Bucket },
      // ["eq", "$acl", "public-read"],
      // 1048576 = 1MB
      // [("content-length-range", 0, 1048576 * 2)],
      ["content-length-range", 1, 1024 * 1024 * 2],
      ["starts-with", "$Content-Type", "image/"],
      // ["starts-with", "$key", "user/example/"]
    ];

    const Fields = {
      // acl: "public-read",
    };

    const params = {
      Body: Key,
      Bucket,
      Key,
      Conditions,
      Fields,
      // number of seconds for which the pre-signed policy should be valid
      Expires: 100000, // 15min
    };

    try {
      const { url, fields } = await createPresignedPost(s3, params);
      resolve({url, fields});
      // return { uploadUrl: url, fields };
    } catch (error) {
      console.log(error);
            reject(err);

    }
  });
};