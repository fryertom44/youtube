const express = require('express');
const router = express.Router();
const Channel = require('../models/index').Channel;
const Video = require('../models/index').Video;

const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

const path = require('path');
const appDir = path.dirname(require.main.filename);
const fs = require('fs');
var channelAttrs = [];

/* GET videos listing. */
router.get('/', function(req, res, next) {
  youtube.search.list(channel_params())
  .then(response => {
    console.log(response.data.items);
    channelAttrs = response.data.items.map(i => {
      return {id: i.id.channelId, channel_name: i.snippet.title}
    });
    console.log(channelAttrs);
    return Channel.bulkCreate(channelAttrs,
      {
        fields:["id", "channel_name"],
        updateOnDuplicate: ["id"]
      }
    )
  })
  .then(channels => {
    const searchKeywords = fs.readFileSync(`${appDir}/search_filter`, "UTF-8");
    channelIds = channels.map(i => i.get('id'));
    return youtube.search.list(
      video_params({channelId: channelIds, q: {title: searchKeywords}})
    )
  })
  .then(response => {
    const videoAttrs = response.data.items.map(i => {
      return {id: i.id.videoId, title: i.snippet.title, date: i.snippet.publishedAt}
    });
    console.log(videoAttrs);
    return Video.bulkCreate(videoAttrs,
      {
        fields:["id", "title", "date"],
        updateOnDuplicate: ["id"]
      }
    )
  })
  .then(videos => {
    console.log(videos);
    res.json({videos: videos});
  })
  .catch(error => {
    console.log('Error fetching videos: ' + error);
    res.json({message: "Something went wrong"});
  })
});

async function search(params) {
  const res = await youtube.search.list(params);
  console.log(res.data);
}

function channel_params() {
  return {
    part: "id,snippet",
    q: "GlobalCyclingNetwork,globalmtb",
    type: "channel",
    fields: "items(id/channelId,snippet(title))",
  };
};

function video_params(params) {
  hash = {
    part: "id,snippet",
    q: params.q,
    type: "video",
    channelId: params.channelId,
    fields: "items(id/videoId,snippet(title,publishedAt))",
  };
  if (typeof params.publishedAt != 'undefined') {
    const searchDate = new Date(params.publishedAt);
    const dateStart = new Date(searchDate.getTime() - 1);
    const dateEnd = new Date(searchDate.getTime() + (24 * 60 * 60 * 1000));

    hash['publishedBefore'] = dateEnd;
    hash['publishedAfter'] = dateStart;
  }
  return hash;
};

module.exports = router;
