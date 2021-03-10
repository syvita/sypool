var express = require('express');
var router = express.Router();

// GET '/'

router.get('/', function(req, res, next) {
  res.send("yo what's good? don't know what you're tryna load this for. i'm useless. like ethereum. lol");
});

module.exports = router;
