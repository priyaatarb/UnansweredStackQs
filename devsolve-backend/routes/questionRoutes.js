const express = require("express");
const db = require("../config/db"); 

const router = express.Router();

// GET all questions
router.get("/", async (req, res) => {
  try {
    let { tag, sortBy } = req.query;
    let query = "SELECT * FROM questions";
    let params = [];

    if (tag) {
      query += " WHERE tags::text ILIKE $1"; 
      params.push(`%${tag}%`);
    }

    if (sortBy) {
      if (sortBy === "difficulty") {
        query += params.length ? " ORDER BY votes DESC" : " ORDER BY votes DESC";
      } else if (sortBy === "popularity") {
        query += params.length ? " ORDER BY created_at DESC" : " ORDER BY created_at DESC";
      }
    }

    const questions = await db.any(query, params);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// GET question by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const question = await db.oneOrNone("SELECT * FROM questions WHERE id = $1", [id]); 
    
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
