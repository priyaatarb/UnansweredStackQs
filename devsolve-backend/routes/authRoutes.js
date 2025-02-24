const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, email, provider, provider_id, profile_picture } = req.body;
    const user = await User.addUser(name, email, provider, provider_id, profile_picture);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

module.exports = router;
