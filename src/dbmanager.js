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
        
        const res = await col.find({filename: setOfData[0].filename}, { projection: { _id: 1} }).toArray();

        if (res.length === 0) {
            await col.insertMany(setOfData);
        } else {
            await col.updateOne({filename: setOfData[0].filename}, {$set: {data: setOfData[0].data}});
        }
        
        //await col.deleteMany();

        await client.close();
    }
}
