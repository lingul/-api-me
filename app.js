// MongoDB
const { MongoClient } = require("mongodb");
const dsn = require("./db/database");
const ObjectID = require('mongodb').ObjectId;
const mongo = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true });

const express = require("express");
const app = express();
const expessjwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 1337;
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
const save = require('./routes/save');
const docs = require('./routes/docs');
const graphql = require('./routes/server');
const docsdata = require('./routes/data');
const routeServerRegister = require("./routes/register.js");
const routeServerLogin = require("./routes/login.js");
const printPDF = require("./routes/print.js");
const mail = require("./routes/mail.js");
const getpdf = require("./routes/getpdf.js");

const fs = require("fs");
const path = require("path");
const http = require('http');
const server = http.createServer(app);
//const ENDPOINT = "https://jsramverk-editor-ligm19.azurewebsites.net";
const ENDPOINT = "http://localhost:1337";
let config;

try {
    config = require('./config/config.js');
} catch (error) {
    console.error(error);
}

const jwtSecret = config.jwtSecret;

const io = require("socket.io")(server, {
    cors: {
      origin: ENDPOINT,
      methods: ["GET", "POST"]
    }
});

async function getFileContents(id) {
    const client  = await mongo.connect();
    const col = await client.db("mumin").collection("crowd");
    //const col = await db.collection("crowd");
    const res = await col.find(
        { _id : new ObjectID(id) },
        { projection: { data: 1, filename: 1} }
    ).toArray();

    await client.close();
    return res.length ? res[0] : null;
}

io.sockets.on('connection', function (socket) {
    console.log("the socket id is: " + socket.id);
    socket.on('auth', function (token) {
        console.log('auth', token);
        jwt.verify(token, jwtSecret, function(err, decoded) {
            if(!err) {
                socket.auth_token=decoded;
            }
        });
    })
    socket.on('create', function (room) {
        if(socket.auth_token) {
            console.log("create; " + room);
            socket.join(room);
            (async function () {
                const f = await getFileContents(room);
                f && socket.emit("created", f);
            })();
        }
    });

    socket.on("update", function (room, data) {
        console.log(room, data);
        socket.to(room).emit("updated", data);
        //send to mongo
    });

    socket.on('leave', function (room) {
        console.log("leave; " + room);
        socket.leave(room);
      });
  });
  

app.use(bodyParser.json());
app.use(cors());
app.use("/register", routeServerRegister);
app.use("/login", routeServerLogin);

app.use(expessjwt({
    secret: jwtSecret,
    algorithms: ['HS256']
}));

app.use('/save', save);
app.use('/getdocs', docs);
app.use('/getdata', docsdata);
app.use('/graphql', graphql);
app.use('/print', printPDF);
app.use('/mail', mail);
app.use('/getpdf', getpdf);

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Testing routes with method
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

// Start up server with websocket and REST GET and POST
server.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = app;