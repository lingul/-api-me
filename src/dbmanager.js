/**
 * Connect to the database and search using a criteria.
 */
"use strict";

// MongoDB
const config = require("./../db/config.json");
const { MongoClient } = require("mongodb");
const dsn = require("../db/database");
const mongo = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true });


module.exports = {
    insert_db: async function(colName, setOfData) {
        const client = await mongo.connect();
        const col = await client.db("mumin").collection(colName);
        
        const res = await col.find({filename: setOfData[0].filename}, { projection: { _id: 1} }).toArray();

        if (res.length === 0) {
            await col.insertMany(setOfData);
        } else {
            await col.updateOne({filename: setOfData[0].filename}, {$set: {data: setOfData[0].data, group: setOfData[0].group}});
        }
        
        //await col.deleteMany();

        await client.close();
    }
}
