'use strict';

const YouTube = require('../services/youtubeService');
const Channel = require('../models/index').Channel;

const ChannelService = {
  store: function(params = {}, YoutubeService = YouTube) {
    return YoutubeService.search.list({
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
