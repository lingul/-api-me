/**
 * Connect to the database and get all docs in mumin, crowd.
 */
"use strict";

var express = require('express');
var router = express.Router();

// MongoDB
const config = require("./../db/config.json");
const { MongoClient } = require("mongodb");
const dsn = require("../db/database");
const mongo = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectId;
const limit1 = 30;

router.get('/', (req, res, next) => {
    let id = req.query.id;
    console.log(id);
    let parse_res = [];
    (async () => {
        try {
            parse_res = JSON.parse(JSON.stringify(await getData()));
        } catch (err) {
            console.log(err);
            //res.send({errormess: err});
        }
        res.send({mess: parse_res});
    })
    ();
    async function getData() {
        const client = await mongo.connect();
        const col = await client.db("mumin").collection("crowd");
        const res = await col.find({ _id: new ObjectId(id) }, { projection: { data: 1, filename: 1} }).limit(limit1).toArray();
        await client.close();
        return res;
    }
});

module.exports = router;