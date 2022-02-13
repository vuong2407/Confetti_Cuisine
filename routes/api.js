const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/coursesController");
const usersController = require("../controllers/usersController");

router.post("/login", usersController.apiAuthenticate);
// router.use(usersController.verifyJWT);

router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourse,
  coursesController.responseJSON,
  coursesController.errorJSON
);

router.get(
  "/courses/:id/join",
  coursesController.join,
  coursesController.responseJSON
);

module.exports = router;
