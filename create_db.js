const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

let db = new sqlite3.Database('./bot.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the bot database.');
  });
fs.readFile('./create.sql', function read(err, data) {
    if (err) {
        throw err;
    }
    const create_db = data.toString();
    console.log(create_db);
    db.run(create_db);

});
