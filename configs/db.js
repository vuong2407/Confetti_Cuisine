const mongoose = require("mongoose");

async function connection() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/recipe_db",
      {
        useNewUrlParser: true,
      }
    );
    console.log("connect succesfull");
  } catch (error) {
    console.log("connect failure");
  }
}

module.exports = { connection };
