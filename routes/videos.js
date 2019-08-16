var express = require('express');
var router = express.Router();

/* GET videos listing. */
router.get('/', function(req, res, next) {
  res.json();
});

module.exports = router;
