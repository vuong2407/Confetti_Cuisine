const express = require("express");
const route = express.Router();
const usersController = require("../controllers/usersController");

route.get("/", usersController.index, usersController.indexView);
route.get("/new", usersController.new);
route.get("/login", usersController.login);
route.post("/login", usersController.authenticate);
route.get("/logout", usersController.logout, usersController.redirectView);
route.get("/:id", usersController.show, usersController.showView);
route.get("/:id/edit", usersController.edit);
route.post(
  "/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
route.put("/:id/update", usersController.update, usersController.redirectView);
route.delete(
  "/:id/delete",
  usersController.delete,
  usersController.redirectView
);

module.exports = route;
