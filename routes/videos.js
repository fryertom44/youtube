const express = require('express');
const router = express.Router();
const VideoSvc = require("../services/videoSvc");

/* GET videos listing. */
router.get('/', function(req, res, next) {
  VideoSvc.store()
  .then(videos => {
    console.log("Videos saved/retrieved: " + videos);
    res.json({videos: videos});
  })
  .catch(error => {
    res.status(error.code || 500);
    res.json({ error: error.errors });
  })
});

module.exports = router;
