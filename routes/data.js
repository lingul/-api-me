/**
 * Connect to the database and get all docs in mumin, crowd.
 */
"use strict";

var express = require('express');
var router = express.Router();

const mongo = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectId;
const dsn = process.env.DBWEBB_DSN || "mongodb://localhost:27017/mumin";

const limit1 = 30;

router.get('/', (req, res, next) => {
    let id = req.query.id;
    let parse_res = [];
    (async () => {
        try {
            parse_res = JSON.parse(JSON.stringify(await getData()));
        } catch (err) {
            console.log(err);
        }
        res.send({mess: parse_res});
    })
    ();
    async function getData() {
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection("crowd");
        const res = await col.find({ _id : new ObjectID(id) }, { projection: { data: 1, filename: 1} }).limit(limit1).toArray();
        await client.close();
        return res;
    }
});

module.exports = router;