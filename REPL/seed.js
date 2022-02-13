const mongoose = require("mongoose");
const subscriber = require("../models/subscriber");

mongoose.connect("mongodb://localhost:27017/recipe_db", {
  useNewUrlParser: true,
});

const contacts = [
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
    zipCode: 10016,
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331,
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103,
  },
];

subscriber.deleteMany().then(() => {
  console.log("subscribers data is empty");
});

let commands = [];

contacts.forEach((contact) => {
  commands.push(
    subscriber.create({
      ...contact,
    })
  );
});

Promise.all(commands)
  .then((result) => {
    console.log(JSON.stringify(result));
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log(`error: ${error}`);
  });
