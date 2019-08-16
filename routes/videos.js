var express = require('express');
var router = express.Router();

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

/* GET videos listing. */
router.get('/', function(req, res, next) {
  youtube.search.list(channel_params())
  .then(response => {
    const channelIds = response.data.items.map(i => i.id.channelId)
    youtube.search.list(
      video_params({q: {channelId: channelIds}})
    )
    .then(response => {
      console.log(response)
      res.json(response.data)
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
    fields: "items(id/videoId,snippet(title,publishedAt))",
  };
};

module.exports = router;
