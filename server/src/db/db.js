import sqlite from "sqlite3";

const PATH = "./src/db/memeDb.db";

// The database is created and the foreign keys are enabled.
const db = new sqlite.Database(PATH, (err) => {
  if (err) throw err;
});

export default db;
