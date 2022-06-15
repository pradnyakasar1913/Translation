const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());
app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));

app.post(
  "/api/uploadFile",
  upload.array("file"),
  uploadFiles,
  processFile,
  endRes
);

function uploadFiles(req, res, next) {
  console.log(req.body);
  console.log(req.file);
  next();
}

async function processFile(req, res, next) {
  const dir = fs.readdirSync("uploads/");
  console.log(dir);
  let arrPromises = [];
  dir.map(async (file) => {
    const content = fs.readFileSync(`uploads/${file}`);
    try {
      console.log("cleanFile called");
      arrPromises.push(cleanFile(req, res, content.toString()));
    } catch (error) {
      res.write("something went wrong at API");
    }
  });
  Promise.all(arrPromises).finally(() => {
    console.log("I am ending res");
    fs.rmdirSync("uploads/", { recursive: true });
    next();
  });
}

function endRes(req, res) {
  res.end();
}

function cleanFile(req, res, content) {
  let newdata = content.split("\n");
  const rawContent = newdata.map((data) => {
    var regex = /(<([^>]+)>)/gi;
    return data.replace(regex, "");
  });
  return translate(req, res, rawContent.join(""));
}

async function translate(req, res, content) {
  const axios = require("axios");
  const sclang = req.body.sclang;
  const targetlang = req.body.targetlang;
  const data = {
    text: content,
    source_language: sclang,
    target_language: targetlang,
  };
  console.log(data);
  try {
    const response = await axios.post(
      "https://www.cfilt.iitb.ac.in/en-mr",
      data
    );
    console.log("I am writing to res");
    console.log(response.data.data);

    const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <div><p><div>${response.data.data}</div></p></div>
        </body>
        </html>
        `;
    const fileName = `${Date.now()}.html`;
    fs.writeFile(`outputHtml/${Date.now()}.html`, htmlContent, function (err) {
      if (err) {
        console.log(err);
      }
      console.log(`${fileName} saved`);
    });

    res.write(response.data.data + "<Br /><Br /><Br /><Br /><hr />");
    return true;
  } catch (error) {
    console.log(error.message);
    return error;
  }
}

app.listen(8000, () => {
  console.log(`Server started On port 8000...`);
});
