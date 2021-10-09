// MongoDB
const { MongoClient } = require("mongodb");
const dsn = require("../db/database");
const ObjectID = require('mongodb').ObjectId;
const mongo = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true });

async function addUser(res, body, hashedPassWord) {
        const client = await mongo.connect();
        const col = await client.db("mumin").collection("doc_users");
        const result = await col.find({user: body.email}, { projection: { _id: 1} }).toArray();

        if (result.length === 0) {
            res = await col.insertOne({user: body.email, pwd: hashedPassWord, group: false});
        } else {
            throw {status: 500, message: "The user already exist!"}
        }
        
        //await col.deleteMany();

        await client.close();
        return res;
};

module.exports = {
    addUser: addUser
};