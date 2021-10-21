var express = require('express');
var router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
    var file = fs.createReadStream("./document.pdf");
    file.pipe(res);
  });
  
module.exports = router;
///Users/linnea/dbwebb-kurser/jsramverk_backend/document.pdf