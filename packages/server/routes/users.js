const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "pool";
const client = new mongoClient(url, { useUnifiedTopology: true });
client.connect();
const db = client.db(dbName);
const collection = db.collection("profiles");

// GET '/users/'

router.get('/', function(req, res) {

  res.send('hello?');
});

router.get('/:userId', function(req, res) {

      const result = collection.find({ _id: userId }).toArray();

      console.log(result);

      res.send(result);
    }
);

module.exports = router;
