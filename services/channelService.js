'use strict';

const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

const Channel = require('../models/index').Channel;

const channelService = {
  store: function(params) {
    return youtube.search.list({
      part: "id,snippet",
      q: params.q,
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
  }
}

module.exports = channelService;
