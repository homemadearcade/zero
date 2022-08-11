"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Requiring AWS SDK.
// Loading dotenv to have access to env variables
_dotenv.default.config(); // Configuring AWS


_awsSdk.default.config = new _awsSdk.default.Config({
  accessKeyId: process.env.S3_KEY,
  // stored in the .env file
  secretAccessKey: process.env.S3_SECRET,
  // stored in the .env file
  region: process.env.BUCKET_REGION // This refers to your bucket configuration.

}); // Creating a S3 instance

const s3 = new _awsSdk.default.S3(); // Retrieving the bucket name from env variable

const Bucket = process.env.BUCKET_NAME; // In order to create pre-signed GET adn PUT URLs we use the AWS SDK s3.getSignedUrl method.
// getSignedUrl(operation, params, callback) ⇒ String
// For more information check the AWS documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
// GET URL Generator

function generateGetUrl(Key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket,
      Key,
      Expires: 120 // 2 minutes

    }; // Note operation in this case is getObject

    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        console.log('ERROR', err);
        reject(err);
      } else {
        // If there is no errors we will send back the pre-signed GET URL
        resolve(url);
      }
    });
  });
} // PUT URL Generator


function generatePutUrl(Key, ContentType) {
  return new Promise((resolve, reject) => {
    // Note Bucket is retrieved from the env variable above.
    const params = {
      Bucket,
      Key,
      ContentType
    }; // Note operation in this case is putObject

    s3.getSignedUrl('putObject', params, function (err, url) {
      if (err) {
        console.log('ERROR', err);
        reject(err);
      } // If there is no errors we can send back the pre-signed PUT URL


      resolve(url);
    });
  });
} // Finally, we export the methods so we can use it in our main application.


var _default = {
  generateGetUrl,
  generatePutUrl
};
exports.default = _default;
//# sourceMappingURL=aws.js.map