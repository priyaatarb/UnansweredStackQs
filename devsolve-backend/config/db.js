const pgp = require("pg-promise")();
require("dotenv").config();

const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 30,
});

// Create Users Table if not exists
const createUsersTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        provider TEXT NOT NULL,
        provider_id TEXT UNIQUE NOT NULL,
        profile_picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

createUsersTable();


//new Table for question storage
const createScrapQuestionsTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS scrapquestions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        link TEXT UNIQUE NOT NULL,
        summary TEXT NOT NULL,
        full_question TEXT NOT NULL,
        votes INTEGER DEFAULT 0,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("ScrapQuestions table created");
  } catch (err) {
    console.error("Error creating questions table:", err);
  }
};

createScrapQuestionsTable();


// Create questions Table if not exists
// const createQuestionsTable = async () => {
//     try {
//       await db.none(`
//         CREATE TABLE IF NOT EXISTS questions (
//           id SERIAL PRIMARY KEY,
//           title TEXT NOT NULL,
//           link TEXT UNIQUE NOT NULL,
//           summary TEXT NOT NULL,
//           votes INTEGER DEFAULT 0,
//           tags TEXT[],
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         )
//       `);
//       console.log("Questions table created");
//     } catch (err) {
//       console.error("Error creating questions table:", err);
//     }
//   };
  
//   createQuestionsTable();



  // Create solutions Table if not exists
  const createSolutionsTable = async () => {
    try {
      await db.none(`
        CREATE TABLE IF NOT EXISTS solutions (
          id SERIAL PRIMARY KEY,
          question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
          user_name TEXT NOT NULL,
          solution TEXT NOT NULL,
          votes INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Solutions table created");
    } catch (err) {
      console.error("Error creating solutions table:", err);
    }
  };
  
  createSolutionsTable();
  
  module.exports = db;