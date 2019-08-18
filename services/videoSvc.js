'use strict';

const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

const Video = require('../models/index').Video;

const path = require('path');
const appDir = path.dirname(require.main.filename);
const fs = require('fs');

const VideoSvc = {
  store: function() {
    return youtube.search.list({
      part: "id,snippet",
      q: "GlobalCyclingNetwork,globalmtb",
      type: "channel",
      fields: "items(id/channelId,snippet(title))"
    })
    .then(response => {
      console.log(response.data.items);
      var channelAttrs = response.data.items.map(i => {
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
      const channelIds = channels.map(i => i.get('id'));
      return youtube.search.list(
        video_params({channelId: channelIds, q: {title: searchKeywords}})
      )
    })
    .then(response => {
      console.log("VideoSvc" + response)
      const videoAttrs = response.data.items.map(i => {
        return {id: i.id.videoId, title: i.snippet.title, date: i.snippet.publishedAt}
      });
      console.log("videoAttrs" + videoAttrs);
      return Video.bulkCreate(videoAttrs,
        {
          fields:["id", "title", "date"],
          updateOnDuplicate: ["id"]
        }
      )
    })
  },
  list: function() {
    return Video.findAll();
  },
  findById: function(id) {
    return Video.findByPk(id);
  },
  destroy: function(id) {
    return Video.findByPk(id).then(video => video.destroy(id));
  }
}

function video_params(params) {
  var hash = {
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

module.exports = VideoSvc;
