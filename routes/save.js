const dbmanager = require('../src/dbmanager');

var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {
    console.log(req.body);
    let test = '[' + JSON.stringify(req.body) + ']';
    dbmanager.insert_db("crowd", JSON.parse(test)).catch(err => console.log(err));
    res.sendStatus(201);
});

module.exports = router;