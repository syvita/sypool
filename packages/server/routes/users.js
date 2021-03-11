const assert = require("assert");
const express = require('express');
const router = express.Router();

const mongoClient = require("mongodb").MongoClient;
const uri = "mongodb://localhost:27017";
const db = 'pool';
// create a new mongoClient
const client = new mongoClient(uri, { useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.log('error');
    console.log(err);
    client.close();

  } else {
    console.log('connected to db')
    const usersCollection = client.db(db).collection('users');
  }
});

// GET '/'

router.get('/:userId', function(req, res, next) {
    res.send("yo what's good? don't know what you're tryna load this for. i'm useless. like ethereum. lol");
});

function handleGetUserProfile(params) {
  
}

module.exports = router;