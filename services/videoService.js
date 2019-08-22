'use strict';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {google} = require('googleapis');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

const { Video } = require('../models/index');
const ChannelService = require('../services/channelService');

const fs = require('fs');

const VideoService = {
  store: function(params) {
    return ChannelService.store(params)
    .then(channels => {
      const searchKeywords = fs.readFileSync(params.filterFilePath, "UTF-8");
      const channelIds = channels.map(i => i.get('id'));
      return youtube.search.list(
        video_params({channelId: channelIds, q: {title: searchKeywords}})
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
  list: function() {
    return Video.findAll();
  },
  findById: function(id) {
    return Video.findByPk(id);
  },
  destroy: function(id) {
    return Video.findByPk(id).then(video => video.destroy(id));
  },
  search: function(query) {
    console.log("params:" + query.title);
    return Video.findAll({ where: { title: {[Op.like]: query.title} }, attributes: ['id', 'title'] });
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

module.exports = VideoService;
