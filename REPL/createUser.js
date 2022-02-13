const mongoose = require("mongoose");
const user = require("../models/user");
const subscriber = require("../models/subscriber");
let testUser;
const userData = {
  name: {
    first: "Jon",
    last: "WexlerVuongNguyen",
  },
  email: "jonVuongNguyen@jonwexler.com",
};
const userDataPassword = "123";

mongoose.connect("mongodb://localhost:27017/recipe_db");

user.register(userData, userDataPassword, (error, user) => {
  if (user) {
    testUser = user;
    subscriber
      .findOne({
        email: testUser.email,
      })
      .then((s) => {
        testUser.subscribedAccount = s;
        testUser.save().then((user) => {
          console.log(user);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log(`error create user: ${error.message}`);
  }
});
