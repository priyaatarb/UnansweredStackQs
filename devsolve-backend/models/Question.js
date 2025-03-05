const db = require("../config/db");

module.exports = {
  addQuestion: async (title, link, summary, full_question, votes, tags) => {
    try {
      const result = await db.oneOrNone(
        `INSERT INTO scrapquestions (title, link, summary, full_question, votes, tags) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (link) DO NOTHING RETURNING *`,
        [title, link, summary, full_question, votes, tags]
      );

      if (result) {
        console.log("Inserted Question:", result.title);
      } else {
        console.log("Skipped (Already Exists):", title);
      }

      return result;
    } catch (err) {
      console.error("Error inserting question:", err);
      return null;
    }
  },

  getAllQuestions: async () => {
    return await db.any("SELECT * FROM scrapquestions ORDER BY created_at DESC");
  },
};
