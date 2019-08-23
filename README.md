# Videos API

A proxy service for the YouTube API

## Setup
Create a user for the database and grant permissions. Set the following environment variables:
YOUTUBE_DB_USER # e.g. 'root'
YOUTUBE_DB_PASSWORD # e.g 'password'
YOUTUBE_DB_HOST # e.g '127.0.0.1'
```
npm install
npx sequelize db:init
npx sequelize db:migrate
npm start
```

## Tests
To test, run `npm test`
