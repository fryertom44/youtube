const express = require('express');
const router = express.Router();

const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

// a very simple example of searching for youtube videos
async function search(params) {
  const res = await youtube.search.list(params);
  console.log(res.data);
}

const path = require('path');
const appDir = path.dirname(require.main.filename);
const fs = require('fs');

/* GET videos listing. */
router.get('/', function(req, res, next) {
  youtube.search.list(channel_params())
  .then(response => {
    const channelIds = response.data.items.map(i => i.id.channelId);
    const searchKeywords = fs.readFileSync(`${appDir}/search_filter`, "UTF-8");
    console.log(searchKeywords);
    youtube.search.list(
      video_params({channelId: channelIds, q: {title: searchKeywords}})
    )
    .then(response => {
      console.log(response);
      res.json(response.data);
    })
    .catch(error => {
      console.log('There is an error: ' + error)
    })
  })
  .catch(error => {
    console.log('There is an error: ' + error)
  })
});

function channel_params() {
  return {
    part: "id,snippet",
    q: "GlobalCyclingNetwork,globalmtb",
    type: "channel",
    fields: "items(id/channelId)",
  };
};

function video_params(params) {
  return {
    part: "id,snippet",
    q: params.q,
    type: "video",
    channelId: params.channelId,
    fields: "items(id/videoId,snippet(title,publishedAt))",
  };
};

module.exports = router;
