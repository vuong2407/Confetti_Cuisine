const subscriber = require("../models/subscriber");

module.exports = {
  index: (req, res, next) => {
    subscriber
      .find({})
      .then((subscribers) => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("subscribers/index");
  },
  new: (req, res) => {
    res.render("subscribers/new");
  },
  create: (req, res, next) => {
    let subscriberParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    };
    subscriber
      .create(subscriberParams)
      .then((subscriber) => {
        res.locals.subscriber = subscriber;
        res.locals.redirect = "/subscribers";
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscriber: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    const subscriberId = req.params.id;
    subscriber
      .findById(subscriberId)
      .then((subscriber) => {
        res.locals.subscriber = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`error fetching subscriber: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("subscribers/show");
  },
  edit: (req, res, next) => {
    const subscriberId = req.params.id;
    subscriber
      .findById(subscriberId)
      .then((subscriber) => {
        res.render("subscribers/edit", { subscriber });
      })
      .catch((error) => {
        console.log(`error fetching subscriber: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    const subscriberId = req.params.id;
    const subscriberParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    };

    subscriber
      .findByIdAndUpdate(subscriberId, {
        $set: subscriberParams,
      })
      .then((subscriber) => {
        res.locals.redirect = `/subscribers/${subscriberId}`;
        next();
      })
      .catch((error) => {
        console.log(`error updating subscriber by id: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    const subscriberId = req.params.id;
    subscriber
      .findByIdAndDelete(subscriberId)
      .then(() => {
        res.locals.redirect = `/subscribers`;
        next();
      })
      .catch((error) => {
        console.log(`error deleting subscriber by id: ${error.message}`);
        next(error);
      });
  },
};
