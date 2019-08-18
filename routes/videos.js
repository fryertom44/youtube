const express = require('express');
const router = express.Router();
const VideoSvc = require("../services/videoSvc");

/* GET videos listing. */
router.post('/store', function(req, res, next) {
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

router.get('/', function(req, res, next) {
  VideoSvc.list()
  .then(videos => {
    console.log("Videos retrieved: " + videos);
    res.json({videos: videos});
  })
  .catch(error => {
    res.status(401);
    res.json({ error: error.name, message: error.message });
  })
});


router.get('/book/:id', function(req, res, next) {
  VideoSvc.findById(req.params['id'])
  .then(video => {
    console.log("Video retrieved: " + video);
    res.json({video: video});
  })
  .catch(error => {
    res.status(422);
    res.json({ error: error.name, message: error.message });
  })
});

router.delete('/book/:id', function(req, res, next) {
  VideoSvc.destroy(req.params['id'])
  .then(video => {
    console.log("Video destroyed: " + video);
    res.json({video: video});
  })
  .catch(error => {
    res.status(422);
    res.json({ error: error.name, message: error.message });
  })
});

router.get('/search', function(req, res, next) {
  VideoSvc.search(req.query)
  .then(videos => {
    console.log("Videos found: " + videos);
    res.json({videos: videos});
  })
  .catch(error => {
    res.status(422);
    res.json({ error: error.name, message: error.message });
  })
});

module.exports = router;
