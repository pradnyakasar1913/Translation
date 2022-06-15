const fs = require("fs");

const { promisify } = require("util");

const readFilePromise = promisify(fs.readFile);
readFilePromise("files/indexe933-2.html", "utf8")
  .then((data) => {
    let newdata = data.split(",");
    newdata.map((data) => {
      return data.replace(/(<([^>]+)>)/, "");
    });

    console.log("newdata", newdata);
  })
  .catch((error) => {
    console.log(error);
  });

console.log("completed");
