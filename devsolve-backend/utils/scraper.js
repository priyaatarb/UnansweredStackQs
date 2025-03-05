const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { addQuestion } = require("../models/Question"); 

puppeteer.use(StealthPlugin());

const scrapeFullQuestion = async (questionUrl) => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  
  await page.goto(questionUrl, { waitUntil: "networkidle2", timeout: 90000 });

  const fullQuestion = await page.evaluate(() => {
    const questionBody = document.querySelector(".s-prose.js-post-body");
    return questionBody ? questionBody.innerHTML : "No Full Question Available";
  });

  await browser.close();
  return fullQuestion;
};

const scrapeUnansweredQuestions = async (tag = "javascript") => {
  const url = `https://stackoverflow.com/questions/tagged/${tag}?tab=Unanswered`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

    const questions = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".s-post-summary")).map((el) => ({
        title: el.querySelector(".s-link")?.innerText || "No Title",
        link: el.querySelector(".s-link")?.href || "#",
        summary:  el.querySelector(".s-post-summary--content-excerpt")?.innerText || "No Summary",
        votes: parseInt(el.querySelector(".s-post-summary--stats-item-number")?.innerText || "0"),
        tags: Array.from(el.querySelectorAll(".post-tag")).map(tag => tag.innerText),
      }));
    });

    await browser.close();

    for (const q of questions) {
      try {
        const full_question = await scrapeFullQuestion(q.link);
        const result = await addQuestion(q.title, q.link, q.summary, full_question, q.votes, q.tags);

        if (result) {
          console.log(`Saved: ${q.title}`);
        } else {
          console.log(`Skipped (Duplicate): ${q.title}`);
        }
      } catch (err) {
        console.error("Error inserting question:", err);
      }
    }

    return questions;
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error("Failed to scrape StackOverflow");
  }
};

module.exports = { scrapeUnansweredQuestions };
