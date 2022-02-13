const user = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const httpStatus = require("http-status-codes");
const jsonWebToken = require("jsonwebtoken");

module.exports = {
  index: (req, res, next) => {
    user
      .find({})
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("users/index");
  },
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      zipCode: req.body.zipCode,
    };

    user.register(userParams, req.body.password, (error, user) => {
      if (user) {
        req.flash(
          "success",
          `${user.fullName}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      }
    });
  },
  redirectView: (req, res) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    const userId = req.params.id;
    user
      .findById(userId)
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`error fetching user: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("users/show");
  },
  edit: (req, res, next) => {
    const userId = req.params.id;
    user
      .findById(userId)
      .then((user) => {
        res.render("users/edit", { user });
      })
      .catch((error) => {
        console.log(`error fetching user: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    const userId = req.params.id;
    const userParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    };

    user
      .findByIdAndUpdate(userId, {
        $set: userParams,
      })
      .then((user) => {
        res.locals.redirect = `/users/${userId}`;
        next();
      })
      .catch((error) => {
        console.log(`error updating user by id: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    const userId = req.params.id;
    user
      .findByIdAndDelete(userId)
      .then(() => {
        res.locals.redirect = `/users`;
        next();
      })
      .catch((error) => {
        console.log(`error deleting user by id: ${error.message}`);
        next(error);
      });
  },
  login: (req, res) => {
    res.render("users/login");
  },
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!",
  }),
  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  },
  // tạm thời validate còn đang bug
  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },
  apiAuthenticate: (req, res, next) => {
    passport.authenticate("local", (errors, user) => {
      if (user) {
        let signedToken = jsonWebToken.sign(
          {
            data: user._id,
            exp: new Date().setDate(new Date().getDate() + 1),
          },
          "secret_encoding_passphrase"
        );
        res.json({
          success: true,
          token: signedToken,
        });
      } else
        res.json({
          success: false,
          message: "Could not authenticate user.",
        });
    })(req, res, next);
  },
  verifyJWT: (req, res, next) => {
    let token = req.headers.token;
    if (token) {
      jsonWebToken.verify(
        token,
        "secret_encoding_passphrase",
        (errors, payload) => {
          if (payload) {
            user.findById(payload.data).then((user) => {
              if (user) {
                next();
              } else {
                res.status(httpStatus.FORBIDDEN).json({
                  error: true,
                  message: "No User account found.",
                });
              }
            });
          } else {
            res.status(httpStatus.UNAUTHORIZED).json({
              error: true,
              message: "Cannot verify API token.",
            });
            next();
          }
        }
      );
    } else {
      res.status(httpStatus.UNAUTHORIZED).json({
        error: true,
        message: "Provide Token",
      });
    }
  },
};
