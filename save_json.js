const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const save = async (favNumber) => {
  console.log("saving");
  await s3
    .putObject({
      Body: JSON.stringify(favNumber, null, 2),
      Bucket: "cyclic-misty-gray-fez-us-east-2",
      Key: "number.json",
    })
    .promise();
};

const save2 = async (jsonContent) => {
  console.log("saving");
  await s3
    .putObject({
      Body: JSON.stringify(jsonContent),
      Bucket: "cyclic-misty-gray-fez-us-east-2",
      Key: "content.json",
    })
    .promise();
};

module.exports = { save, save2 };
