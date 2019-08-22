'use strict';

const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

const Channel = require('../models/index').Channel;

const ChannelService = {
  store: function(params) {
    return youtube.search.list({
      part: "id,snippet",
      q: params.channels,
      type: "channel",
      fields: "items(id/channelId,snippet(title))"
    })
    .then(response => {
      var channelAttrs = response.data.items.map(i => {
        return {id: i.id.channelId, channel_name: i.snippet.title}
      });
      return Channel.bulkCreate(channelAttrs,
        {
          fields:["id", "channel_name"],
          updateOnDuplicate: ["id"]
        }
      )
    })
  }
}

module.exports = ChannelService;
