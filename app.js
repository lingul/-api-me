const express = require("express");
const app = express();
const port = 1337;
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
const index = require('./routes/index');
const hello = require('./routes/hello');



app.use('/', index);
app.use('/hello', hello);

app.use(express.json());
// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});


app.use(cors());
// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Testing routes with method
app.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request"
        }
    });
});

app.post("/user", (req, res) => {
    res.status(201).json({
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
