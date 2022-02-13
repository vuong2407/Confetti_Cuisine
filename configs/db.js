const mongoose = require("mongoose");

async function connection() {
  try {
    console.log(`enviromentttttttttt: ${process.env.MONGODB_URI}`);
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://NguyenVuong:vuongnguyen04040707@cluster0.oojhw.mongodb.net/recipe_db",
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
