var express = require('express');
var router = express.Router();

// GET '/users/'

router.get('/', function(req, res, next) {
  res.send("i'll do something i promise");
});

module.exports = router;
