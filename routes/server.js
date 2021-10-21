const express = require("express");
const router  = express.Router();
const { graphql, buildSchema } = require('graphql');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

// MongoDB
const config = require("./../db/config.json");
const { MongoClient } = require("mongodb");
const dsn = require("../db/database");
const mongo = new MongoClient(dsn, { useNewUrlParser: true, useUnifiedTopology: true });

router.get('/', (req, res) => {

  const schema = buildSchema(`
    scalar JSON
    type Query {
      getObject: JSON
    }
  `);

  
  // The root provides a resolver function for each API endpoint
  const root = {
    JSON: GraphQLJSONObject,
    getObject: async () => {
      //return {"_id": "000", "filename": "something went wrong"};
      const data = await getData();
      console.log("DATA", data);
      return data;
    }
  };

  async function getData() {
      try {
        return JSON.parse(JSON.stringify(req.user.group? 
              await getAllIdAndFileNames({}):
              await getAllIdAndFileNames({group: false})));
      } catch (err) {
          console.log("ERROR", err);
          return err;
      }
  };

  async function getAllIdAndFileNames(query) {
    console.log("CALL DB");
    const client = await mongo.connect();
    const col = client.db("mumin").collection("crowd");
    const db_res = await col.find(query, { projection: { _id: 1, filename: 1} }).toArray();
    await client.close();
    return db_res;
};

  async function extractFromGraphQl() {
      // Run the GraphQL query '{ hello }' and print out the response
      return graphql(schema, '{ getObject }', root);
  };

  async function startGraphQl() {
      const answer = await extractFromGraphQl();
      console.log("testtts", answer.data.getObject);
      res.send({mess: answer.data.getObject});
      /*return res.status(200).json({
        data: {
            status: 200,
            type: "success",
            message: cleaned["data"]["getObject"],
        }
      });*/
  };

  startGraphQl();

});

module.exports = router;

