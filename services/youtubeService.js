const {google} = require('googleapis');

// initialize the Youtube API library
const YoutubeService = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

module.exports = YoutubeService;
