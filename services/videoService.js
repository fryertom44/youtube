'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { Video } = require('../models/index');
// const YoutubeService = require('../services/youtubeService');
const ChannelService = require('../services/channelService');
const YouTube = require('../services/youtubeService');
const fs = require('fs');

const VideoService = {
  store: function(params = {}, YoutubeService = YouTube) {
    return ChannelService.store(params, YoutubeService)
    .then(channels => {
      const searchKeywords = fs.readFileSync(params.filterFilePath, "UTF-8");
      const channelIds = channels.map(i => i.get('id'));
      return YoutubeService.search.list(
        video_params(
          {
            channelId: channelIds,
            publishedAt: params.publishedAt,
            q: {title: searchKeywords}
          }
        )
      )
    })
    .then(response => {
      const videoAttrs = response.data.items.map(i => {
        return {id: i.id.videoId, title: i.snippet.title, date: i.snippet.publishedAt}
      });
      return Video.bulkCreate(videoAttrs,
        {
          fields:["id", "title", "date"],
          updateOnDuplicate: ["id"]
        }
      )
    })
  },
  list: function(opts={}) {
    return Video.findAll(opts);
  },
  findById: function(id) {
    return Video.findByPk(id);
  },
  destroy: function(id) {
    return Video.findByPk(id).then(video => video.destroy(id));
  },
  search: function(query) {
    return Video.findAll(
      { where: { title: {[Op.like]: `%${query.title}%`} },
      order: [['date', 'DESC'], ['title', 'ASC']],
      attributes: ['id', 'title', 'date'] }
    );
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
  if (params.publishedAt) {
    const searchDate = new Date(params.publishedAt);
    const dateStart = new Date(searchDate.getTime() - 1);
    const dateEnd = new Date(searchDate.getTime() + (24 * 60 * 60 * 1000));

    hash['publishedBefore'] = dateEnd;
    hash['publishedAfter'] = dateStart;
  }
  return hash;
};

module.exports = VideoService;
