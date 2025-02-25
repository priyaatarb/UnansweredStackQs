const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Submit a solution
router.post("/add", async (req, res) => {
  try {
    const { question_id, user_id, solution } = req.body;
    const newSolution = await db.one(
      `INSERT INTO solutions (question_id, user_id, solution) 
       VALUES ($1, $2, $3) RETURNING *`,
      [question_id, user_id, solution]
    );
    res.json(newSolution);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit solution" });
  }
});

// Upvote/Downvote Solution
router.post("/vote", async (req, res) => {
  try {
    const { solution_id, type } = req.body;
    const increment = type === "upvote" ? 1 : -1;
    const updatedSolution = await db.one(
      `UPDATE solutions SET votes = votes + $1 WHERE id = $2 RETURNING *`,
      [increment, solution_id]
    );
    res.json(updatedSolution);
  } catch (err) {
    res.status(500).json({ error: "Failed to vote" });
  }
});

// Get solutions for a question
router.get("/:question_id", async (req, res) => {
  try {
    const solutions = await db.any(
      "SELECT * FROM solutions WHERE question_id = $1 ORDER BY votes DESC",
      [req.params.question_id]
    );
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch solutions" });
  }
});

router.post("/upvote/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Increase votes count
    await db.none("UPDATE solutions SET votes = votes + 1 WHERE id = $1", [id]);

    // Get updated vote count
    const updatedSolution = await db.one("SELECT votes FROM solutions WHERE id = $1", [id]);

    res.json({ success: true, votes: updatedSolution.votes });
  } catch (err) {
    console.error("Error in upvoting:", err);
    res.status(500).json({ error: "Failed to upvote solution" });
  }
});

router.post("/downvote/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Decrease votes count
    await db.none("UPDATE solutions SET votes = GREATEST(0, votes - 1) WHERE id = $1", [id]);

    // Get updated vote count
    const updatedSolution = await db.one("SELECT votes FROM solutions WHERE id = $1", [id]);

    res.json({ success: true, votes: updatedSolution.votes });
  } catch (err) {
    console.error("Error in downvoting:", err);
    res.status(500).json({ error: "Failed to downvote solution" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const solutions = await db.any(
      `SELECT s.id, s.solution, s.votes, s.created_at, u.username
       FROM solutions s
       JOIN users u ON s.user_id = u.id
       WHERE s.question_id = $1
       ORDER BY s.votes DESC`,
      [id]
    );

    res.json(solutions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch solutions" });
  }
});

module.exports = router;
