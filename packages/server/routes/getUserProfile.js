const mongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const express = require('express');
const router = express.Router();

// connection url
const url = "mongodb://localhost:27017";

// database name
const dbName = "pool";

var result = null;

// create a new mongoClient
const client = new mongoClient(url, { useUnifiedTopology: true });

const findDocuments = function (db, callback) {
  // get the profiles collection
  const collection = db.collection("profiles");

  // find some documents

  const findEm = function(){
      collection.find({ a: 3 }).toArray(function (err, docs) {
        assert.strictEqual(err, null);
        console.log("found the following documents");
        console.log(docs);
        result = docs;
        callback(docs);
  })};

  findEm();

  console.log(result);

  //return result;
};

// GET '/'

router.get('/', function(req, res, next) {
    client.connect(function (err) {
        assert.strictEqual(null, err);
        console.log("connected successfully to server");
    
        const db = client.db(dbName);
    
        const result = findDocuments(db, function () {
          client.close();
        });
    
        return result;
      });
    res.send("yo what's good? don't know what you're tryna load this for. i'm useless. like ethereum. lol");
});

module.exports = router;