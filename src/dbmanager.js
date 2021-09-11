/**
 * Connect to the database and search using a criteria.
 */
"use strict";

// MongoDB
const mongo = require("mongodb").MongoClient;
const dsn =  "mongodb://localhost:27017/mumin";
//const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/mumin";


module.exports = {
    insert_db: async function(colName, setOfData) {
        const client  = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);

        //await col.deleteMany();
        await col.insertMany(setOfData);

        await client.close();
    }
}
