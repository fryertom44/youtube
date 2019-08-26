# Videos API

A proxy service for the YouTube API

## Setup
* Create a user for the database and grant permissions. Open a shell prompt and type:
```bash
mysql -u root -p
```
Then run the following SQL commands (replacing user, password and localhost for your own preferences)
```sql
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
GRANT permission ON database.table TO 'user'@'localhost';
```
* Rename ".env.example" file to ".env" and make sure the variables contain the correct information
* Run:
```bash
npm install
npx sequelize db:init
npx sequelize db:migrate
npm start
```

These are the exposed endpoints:
```
GET /api/v1/videos/               # List videos
GET /api/v1/videos/search         # Search videos. Parameters: title=keywords
GET /api/v1/videos/video/:id      # Get video by id. Parameters: id=id
DELETE /api/v1/videos/video/:id   # Delete video by id. Parameters: id=id
POST /api/v1/videos/store         # Store videos in database. Parameters: publishedAt=date
```

## Tests
To test, run `npm test`.

## Notes for assessment
* This was my very first Node.js app, and completing it was a worthwhile (but tiring!) experience. I'm sure there will be errors or unconventional ways of doing things
* I've split the video and channel service into two separate service classes - one creates the channel/s and the other deals with videos.
* I've created migrations to mirror the sql schema given in the youtube.sql file. If there is a simpler way to load the schema into the database without doing it through the MySql console, I don't know what it is.
* I've stored credentials in a .env file, using the 'dotenv' library (see '.env.example').
* the biggest fault I'm aware of are missing tests covering the http request/response. Testing it properly would require mocking the YouTube response, and this is something I haven't had time to figure out yet in Javascript. I've written unit tests covering the service classes, but in a normal app this would be insufficient test coverage - integration tests would be required also.
