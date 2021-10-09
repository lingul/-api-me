/**
 * Connect to the database and get all docs in mumin, crowd.
 */
"use strict";

var express = require('express');
var router = express.Router();
//var config = require("./../db/config.json");
var dbmaneger = require("./../src/dbmanager.js");

// MongoDB
const config = require("./../db/config.json");
const { MongoClient } = require("mongodb");
const dsn = require("../db/database");
const mongo = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true });

//const limit1 = 30;

router.get('/', (req, res, next) => {
    let parse_res;
    (async () => {
        try {
            parse_res = JSON.parse(JSON.stringify(req.user.group? 
                await findInCollection({}):
                await findInCollection({group: false})));
        } catch (err) {
            console.log(err);
        }
        res.send({mess: parse_res});
    })
    ();
    async function findInCollection(query) {
        const client = await mongo.connect();
        const col = await client.db("mumin").collection("crowd");
        const res = await col.find(query, { projection: { _id: 1, filename: 1} }).toArray();
        await client.close();
        return res;
    }
});

module.exports = router;