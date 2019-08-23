# Videos API

A proxy service for the YouTube API

## Setup
* Create a user for the database and grant permissions.
* Create a .env file in the project root folder with the following variables:
  YOUTUBE_DB_USER='youtube'
  YOUTUBE_DB_PASSWORD='password'
  YOUTUBE_DB_HOST='127.0.0.1'
```
npm install
npx sequelize db:init
npx sequelize db:migrate
npm start
```

## Tests
To test, run `npm test`
