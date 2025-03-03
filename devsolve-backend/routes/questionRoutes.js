const express = require("express");
const db = require("../config/db"); 

const router = express.Router();

// GET all questions
router.get("/", async (req, res) => {
  try {
    let { tag, sortBy } = req.query;
    
    // ✅ Base SQL query
    let query = `
      SELECT 
        q.id, 
        q.title, 
        q.link,
        q.summary, 
        q.votes, 
        q.tags, 
        q.created_at,
        COUNT(s.id) AS answer_count  
      FROM scrapquestions q
      LEFT JOIN solutions s ON s.question_id = q.id
    `;

    let params = [];

    // ✅ Filter by tag (if provided)
    if (tag) {
      query += " WHERE q.tags::text ILIKE $1";
      params.push(`%${tag}%`);
    }

    query += " GROUP BY q.id, q.title, q.link, q.summary, q.votes, q.tags, q.created_at";

    // ✅ Sorting logic
    if (sortBy) {
      if (sortBy === "popularity") {
        query += " ORDER BY q.votes DESC"; // Most votes first
      } else if (sortBy === "recent") {
        query += " ORDER BY q.created_at DESC"; // Most recent first
      }
    } else {
      query += " ORDER BY q.created_at DESC"; // Default sorting
    }

    const questions = await db.any(query, params);
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});




// GET question by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.oneOrNone("SELECT * FROM scrapquestions WHERE id = $1", [id]); 
    
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ error: "Failed to fetch question" });
  }
});









module.exports = router;
