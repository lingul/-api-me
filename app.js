const express = require("express");
const app = express();
const port = process.env.PORT || 1337;
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
const index = require('./routes/index');
const hello = require('./routes/hello');
const save = require('./routes/save');
const docs = require('./routes/docs');
const docsdata = require('./routes/data');
const fs = require("fs");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/save', save);
app.use('/getdocs', docs);
app.use('/getdata', docsdata);
app.use('/hello', hello);

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Testing routes with method
app.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request"
        }
    });
});

app.post("/user", (req, res) => {
    res.status(200).json({
        data: {
            msg: "Got a POST request, sending back Created"
        }
    });
});


app.put("/user", (req, res) => {
    // PUT requests should return 204 No Content
    res.status(204).send();
});

app.delete("/user", (req, res) => {
    // DELETE requests should return 204 No Content
    res.status(204).send();
});

// Add a route
app.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});


app.get("/hello/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = app;