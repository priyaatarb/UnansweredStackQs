const db = require("../config/db");

module.exports = {
  addUser: async (name, email, provider, provider_id, profile_picture) => {
    try {
      return await db.one(
        `INSERT INTO users (name, email, provider, provider_id, profile_picture) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (provider_id) DO UPDATE SET name = $1, email = $2, profile_picture = $5 
         RETURNING *`,
        [name, email, provider, provider_id, profile_picture]
      );
    } catch (err) {
      console.error("Error inserting user:", err);
    }
  },
  getUserByProviderId: async (provider_id) => {
    return await db.oneOrNone("SELECT * FROM users WHERE provider_id = $1", [provider_id]);
  },
};
