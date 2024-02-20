const { Router } = require("express");
const { save, save2 } = require("../save_json");
let favouriteNumber = require("../number.json");
const add = require("../add");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const router = new Router();

router.get("/sum/:number1/:number2", async (req, res) => {
  let my_file = await s3
    .getObject({
      Bucket: "cyclic-misty-gray-fez-us-east-2",
      Key: "number.json",
    })
    .promise();
  const favNumber = JSON.parse(my_file.Body)?.favouriteNumber;
  const { number1, number2 } = req.params;
  if (number1 == null || number2 == null) {
    res.status(400).send("Not provided numbers");
    return;
  }
  if (isNaN(parseInt(number1)) || isNaN(parseInt(number2))) {
    res.status(400).send("Numbers needs to be integer");
    return;
  }
  let result = add(parseInt(number1), parseInt(number2));
  if (favNumber != null) {
    result = add(result, favNumber);
  }
  res.json({
    status: "success",
    result: result,
  });
});

router.post("/favNumber", async (req, res) => {
  const { number } = req.body;
  if (number == null) {
    res.status(400).send("Not provided number");
    return;
  }
  if (isNaN(parseInt(number))) {
    res.status(400).send("The number needs to be integer");
    return;
  }
  await save({
    favouriteNumber: number,
  });
  res.json({
    status: "success",
    newFavouriteNumber: number,
  });
});

router.post("/newContent", async (req, res) => {
  const { content } = req.body;
  if (typeof content !== "string") {
    res.status(400).send("please input string");
    return;
  }
  await save2({
    Content: content,
  });
  res.json({
    status: "success",
    newContent: content,
  });
});

router.get("/", async (req, res) => {
  let response = await s3
    .getObject({
      Bucket: "cyclic-misty-gray-fez-us-east-2",
      Key: "content.json",
    })
    .promise();

  let content = JSON.parse(response.Body.toString("utf-8"));
  res.json({
    status: "success",
    result: content,
  });
});

module.exports = router;
