const express = require("express");
const route = express.Router();
const subscribersController = require("../controllers/subscribersController");

route.get("/", subscribersController.index, subscribersController.indexView);
route.get("/new", subscribersController.new);
route.get("/:id", subscribersController.show, subscribersController.showView);
route.get("/:id/edit", subscribersController.edit);
route.post(
  "/create",
  subscribersController.create,
  subscribersController.redirectView
);
route.put(
  "/:id/update",
  subscribersController.update,
  subscribersController.redirectView
);
route.delete(
  "/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);

module.exports = route;
