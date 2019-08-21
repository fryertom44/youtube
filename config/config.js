// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.YOUTUBE_DB_USER,
    password: process.env.YOUTUBE_DB_PASSWORD,
    database: "mydb",
    host: process.env.YOUTUBE_DB_HOST,
    dialect: "mysql"
  },
  test: {
    username: process.env.YOUTUBE_DB_USER,
    password: process.env.YOUTUBE_DB_PASSWORD,
    database: "mydb_test",
    host: process.env.YOUTUBE_DB_HOST,
    dialect: "mysql"
  },
  production: {
    username: process.env.YOUTUBE_DB_USER,
    password: process.env.YOUTUBE_DB_PASSWORD,
    database: "mydb",
    host: process.env.YOUTUBE_DB_HOST,
    dialect: "mysql"
  }
};

