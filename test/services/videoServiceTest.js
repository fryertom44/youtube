const { expect } = require ('chai');
var chai = require('chai');
chai.use(require('chai-datetime'));
const sinon = require('sinon');

var YoutubeService = require('../../services/youtubeService');
const Video = require('../../models/index').Video;
const VideoService = require("../../services/videoService");
const { VideoFactory } = require('../factories/video');

var mochaAsync = (fn) => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

describe('VideoService', function() {

  beforeEach(async function() {
    await Video.destroy({where: {}});
  });

  describe('#list()', function() {
    it('should list videos', mochaAsync(async () => {
      const video1 = await VideoFactory({date: '2019-01-01'});
      const video2 = await VideoFactory({date: '2019-02-02'});
      const video3 = await VideoFactory({date: '2019-03-03'});
      const video4 = await VideoFactory({date: '2019-04-04'});
      const videos = await VideoService.list({
        order: [['date', 'ASC'], ['title', 'ASC']],
        attributes: ['id', 'title', 'date']
      }).map(el => el.get({ plain: true }));
      expect(videos).to.eql(
        [
          video1.get({plain: true}),
          video2.get({plain: true}),
          video3.get({plain: true}),
          video4.get({plain: true}),
        ]
      );
    }));
  });

  describe('#destroy()', function() {
    it('should destroy video', mochaAsync(async () => {
      var video = await VideoFactory();
      await VideoService.destroy(video.id);
      video = await VideoService.findById(video.id);
      expect(video).to.be.null;
    }));
  });

  describe('#findById()', function() {
    it('should return a video', mochaAsync(async () => {
      const existingVideo = await VideoFactory();
      const retrievedVideo = await VideoService.findById(existingVideo.id);
      expect(
        retrievedVideo.get(['id', 'title'], {plain: true})
      ).to.eql(
        existingVideo.get(['id', 'title'], {plain: true})
      );
    }));
  });

  describe('#search()', function() {
    it('should find videos based on search criteria', mochaAsync(async () => {
      const video1 = await VideoFactory({title: "Mountain Bikes", date: '2019-01-01'});
      const video2 = await VideoFactory({title: "Touring Bikes", date: '2019-02-02'});
      const video3 = await VideoFactory({title: "Hybrid Bikes", date: '2019-03-03'});
      const video4 = await VideoFactory({title: "Racing Bikes", date: '2019-04-04'});
      const videos = await VideoService.search(
        {title: "Hybrid"}
      ).map(el => el.get({ plain: true }));
      expect(videos).to.eql(
        [ video3.get({plain: true}) ]
      );
    }));
  });

  describe('#store()', function() {
    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
      var fakeYoutubeResponse = function(params) {
        return new Promise(function(resolve, reject) {
          if (params.type == 'channel') {
            var response = { data: {items: [{id: {channelId: 'randomchannelid'}, snippet: {title: 'Channel Title'}}] }};
          } else {
            var response = { data: {items: [{id: {videoId: 'randomvideoid'}, snippet: {title: 'Video Title', publishedAt: "2016-08-16T12:00:00.000Z"}}] }};
          }
          resolve(response);
        });
      }
      sandbox.stub(YoutubeService.search, "list").callsFake(fakeYoutubeResponse);
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should store videos', mochaAsync(async () => {
      var videos = await VideoService.store(
        {channels: 'some channel', filterFilePath: `./bin/search_filter`}, YoutubeService);

      var videos = await VideoService.list({
        order: [['date', 'ASC'], ['title', 'ASC']],
        attributes: ['id', 'title', 'date']
      }).map(el => el.get({ plain: true }));

      expect(videos.length).to.eql(1);
      expect(videos[0]).to.eql({
        "date": new Date("2016-08-16T12:00:00.000Z"),
        "id": "randomvideoid",
        "title": "Video Title",
      });
    }));
  });
});
