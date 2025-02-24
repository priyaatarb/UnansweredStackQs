const db = require("../config/db");

module.exports = {
  addQuestion: async (title, link, votes, tags) => {
    try {
      const result = await db.oneOrNone(
        `INSERT INTO questions (title, link, votes, tags) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (link) DO NOTHING RETURNING *`,
        [title, link, votes, tags]
      );

      if (result) {
        console.log(" Inserted Question:", result.title);
      } else {
        console.log(" Skipped (Already Exists):", title);
      }

      return result;
    } catch (err) {
      console.error(" Error inserting question:", err);
      return null;
    }
  },

  getAllQuestions: async () => {
    return await db.any("SELECT * FROM questions ORDER BY created_at DESC");
  },
};
