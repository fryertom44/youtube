const express = require('express');
const router = express.Router();
const VideoService = require("../services/videoService");

const path = require('path');
const appDir = path.dirname(require.main.filename);

/* GET videos listing. */
router.post('/store', function(req, res, next) {
  VideoService.store(
    {
      channels: "GlobalCyclingNetwork,globalmtb",
      publishedAt: req.query.publishedAt,
      filterFilePath: `${appDir}/search_filter`,
    }
  )
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
  VideoService.list()
  .then(videos => {
    console.log("Videos retrieved: " + videos);
    res.json({videos: videos});
  })
  .catch(error => {
    res.status(401);
    res.json({ error: error.name, message: error.message });
  })
});


router.get('/video/:id', function(req, res, next) {
  VideoService.findById(req.params['id'])
  .then(video => {
    console.log("Video retrieved: " + video);
    res.json({video: video});
  })
  .catch(error => {
    res.status(422);
    res.json({ error: error.name, message: error.message });
  })
});

router.delete('/video/:id', function(req, res, next) {
  VideoService.destroy(req.params['id'])
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
  VideoService.search(req.query)
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
