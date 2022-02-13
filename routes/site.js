const express = require("express");
const route = express.Router();
const siteController = require("../controllers/siteController");
const homeController = require("../controllers/homeController");

route.get("/", siteController.showHome);
route.get("/chat", homeController.chat);

module.exports = route;
