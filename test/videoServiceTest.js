const assert = require ('assert');
const { expect } = require ('chai');
var chai = require('chai');
chai.use(require('chai-datetime'));

const { sequelize } = require('../models/index');
const Video = require('../models/index').Video;
const VideoService = require("../services/videoService");
const { VideoFactory } = require('./factories/video');

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
      ).to.eql(existingVideo.get(['id', 'title'], {plain: true}));
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
        [
          video3.get({plain: true}),
         ]
      );
    }));
  });

  describe('#store()', function() {
    it('should store videos', mochaAsync(async () => {
      const videos = await VideoService.store();
      expect(true).to.eql(false);
    }));
  });
});
