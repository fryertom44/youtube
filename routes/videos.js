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
    res.status(error.code || 500);
    res.json({ error: error.errors });
  })
});


router.get('/:id', function(req, res, next) {
  VideoSvc.findById(req.params['id'])
  .then(video => {
    console.log("Video retrieved: " + video);
    res.json({video: video});
  })
  .catch(error => {
    res.status(error.code || 500);
    res.json({ error: error.errors });
  })
});


router.delete('/:id', function(req, res, next) {
  VideoSvc.destroy(req.params['id'])
  .then(video => {
    console.log("Video destroyed: " + video);
    res.json({video: video});
  })
  .catch(error => {
    res.status(error.code || 500);
    res.json({ error: error.errors });
  })
});

module.exports = router;
