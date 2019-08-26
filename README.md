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
```
npm install
npx sequelize db:init
npx sequelize db:migrate
npm start
```

## Tests
To test, run `npm test`
