const express = require("express");
const cors = require("cors");
const questionRoutes = require("./routes/questionRoutes");
const solutionRoutes = require("./routes/solutionRoutes");
const authRoutes = require("./routes/authRoutes");
const { scrapeUnansweredQuestions } = require("./utils/scraper");
require("dotenv").config();
const db = require("./config/db"); 

const app = express();
app.use(express.json());

// Improved CORS settings (Allow frontend and API clients)
app.use(cors({
  origin: ["http://localhost:3000 || https://devsolve-plum.vercel.app/", "http://localhost:5000"], 
  credentials: true
}));

// Health Check Route for checking the database connection
app.get("/api/health", async (req, res) => {
  try {
    const result = await db.query("SELECT 1");  
    res.json({ status: "OK", database: "Connected" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

//  Main Routes
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/solutions", solutionRoutes);

// Scrape Questions Route
app.get("/api/scrape/:tag", async (req, res) => {
  const { tag } = req.params;
  
  try {
    console.log(`Scraping StackOverflow for tag: ${tag}`);
    const questions = await scrapeUnansweredQuestions(tag);
    
    if (!questions || !Array.isArray(questions)) {
      throw new Error("Invalid scraper response");
    }

    res.json(questions);
  } catch (error) {
    console.error("Scraper Error:", error);
    res.status(500).json({ error: "Failed to scrape questions" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
