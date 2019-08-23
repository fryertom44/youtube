const assert = require ('assert');
const { expect } = require ('chai');
var chai = require('chai');
chai.use(require('chai-datetime'));
const sinon = require('sinon');

var YoutubeService = require('../../services/youtubeService');
const ChannelService = require('../../services/channelService');
const Channel = require('../../models/index').Channel;

var mochaAsync = (fn) => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

describe('ChannelService', function() {

  beforeEach(async function() {
    await Channel.destroy({where: {}});
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

    it('should store channels', mochaAsync(async () => {
      var channels = await ChannelService.store(
        {channels: 'some channel'}, YoutubeService);

      var channels = await Channel.findAll({
        order: [['channel_name', 'ASC']],
        attributes: ['id', 'channel_name']
      }).map(el => el.get({ plain: true }));

      expect(channels.length).to.eql(1);
      expect(channels[0]).to.eql({
        "id": "randomchannelid",
        "channel_name": "Channel Title",
      });
    }));
  });
});
