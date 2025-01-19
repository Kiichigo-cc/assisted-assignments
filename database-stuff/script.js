const sqlite3 = require('sqlite3').verbose();

// Create a new database file
let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database!');
  }
});


// Create the `users` table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    assignment TEXT NOT NULL,
    chatlogs TEXT NOT NULL
  )`, // Removed the trailing comma
  (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully!');
    }
  }
);

// Create the `assignments` table
db.run(
  `CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT
  )`, // Correct syntax for an empty table with only a primary key
  (err) => {
    if (err) {
      console.error('Error creating assignments table:', err.message);
    } else {
      console.log('Assignments table created successfully!');
    }
  }
);

// Create the `chatbots` table
db.run(
  `CREATE TABLE IF NOT EXISTS chatbots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_response TEXT NOT NULL
  )`, // Removed the trailing comma
  (err) => {
    if (err) {
      console.error('Error creating chatbots table:', err.message);
    } else {
      console.log('Chatbots table created successfully!');
    }
  }
);

// Close the database
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
