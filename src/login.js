"use strict";
// MongoDB
const { MongoClient } = require("mongodb");
const dsn = require("../db/database");
const ObjectID = require('mongodb').ObjectId;
const mongo = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true });

const jwt = require('jsonwebtoken');

let config;

try {
    config = require('../config/config.js');
} catch (error) {
    console.error(error);
}

const jwtSecret = config.jwtSecret;

const DB = require("../db/database.js");



//  * Gets a user from the user table.
// /**
//  * @async
//  * @returns void
//  */
async function getUser(res, body) {
        const client = await mongo.connect();
        const col = client.db("mumin").collection("doc_users");
        const result = await col.find({user: body.email}, { projection: { user: 1, pwd: 1, group: 1} }).toArray();
        await client.close();
        console.log("FROM DB " + result);

        /*
        let sql = `
                SELECT ROWID as id, email, password
                FROM users
                WHERE email = ?`;

        sqliteDB.get(sql, email, function(err, row) {
            if (err) {
                // console.log("err.message från src/login.js: ", err.mesage);
                // console.log("err från src/login.js: ", err);
                reject(err.message);
            } else if (row === undefined) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            } else {
                resolve(row);
            }
        });
        */
        if(!result) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "User not found",
                    detail: "User with provided email not found."
                }
            });
        }
        else {
            return result.length > 0 ? result[0]: null;
        };


}


function checkToken(req, res, next) {
    var token = req.headers['authorization'];

    if (token) {
        // jwt.verify(token, jwtSecret, function(err, decoded) {
        jwt.verify(token, jwtSecret, function(err) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: req.path,
                        title: "Failed authentication",
                        detail: err.message
                    }
                });
            }

            next();

            return undefined;
        });
    } else {
        return res.status(401).json({
            errors: {
                status: 401,
                source: req.path,
                title: "No token",
                detail: "No token provided in request headers"
            }
        });
    }
}

module.exports = {
    getUser: getUser,
    checkToken: checkToken
};