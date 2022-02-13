const userRoute = require("./users");
const siteRoute = require("./site");
const subscriberRoute = require("./subscribes");
const courseRoute = require("./courses");
const apiRoute = require("./api");

function route(app) {
  app.use("/", siteRoute);
  app.use("/users", userRoute);
  app.use("/courses", courseRoute);
  app.use("/subscribers", subscriberRoute);
  app.use("/api", apiRoute);
}

module.exports = route;
