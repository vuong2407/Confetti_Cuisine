const course = require("../models/course");
const httpStatus = require("http-status-codes");
const user = require("../models/user");

module.exports = {
  index: (req, res, next) => {
    course
      .find({})
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`error fetching courses: ${error.message}`);
      });
  },
  indexView: (req, res) => {
    if (req.query.format === "json") {
      res.json(res.locals.courses);
    } else {
      res.render("courses/index");
    }
  },
  responseJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject);
  },
  join: (req, res, next) => {
    const courseId = req.params.id;
    const currentUser = req.user;

    if (currentUser) {
      user
        .findByIdAndUpdate(currentUser._id, {
          $addToSet: {
            courses: courseId,
          },
        })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      console.log("you must log in.");
      next();
    }
  },
  filterUserCourse: (req, res, next) => {
    const currentUser = req.user;
    if (currentUser) {
      const mappedCouses = res.locals.courses.map((course) => {
        const userJoined = currentUser.courses.some((userCourse) =>
          course.equals(userCourse._id)
        );
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCouses;
      next();
    } else {
      next();
    }
  },
};
