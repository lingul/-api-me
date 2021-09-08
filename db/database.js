const mongo = require("mongodb").MongoClient;
const config = require("./config.json");
const collectionName = "docs";
const port = process.env.PORT || 1337;

let dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.hkfbt.mongodb.net/folinodocs?retryWrites=true&w=majority`;

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb://localhost:27017/mumin`;

        if (process.env.NODE_ENV === 'mumin') {
            dsn = "mongodb://localhost:27017/mumin";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;