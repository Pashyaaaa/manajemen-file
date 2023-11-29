import sqlite from "sqlite3";
const db = new sqlite.Database("./token.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.log(err);
});

const sql = `CREATE TABLE token(ID INTEGER PRIMARY KEY NOT NULL, token TEXT)`;

db.run(sql);
