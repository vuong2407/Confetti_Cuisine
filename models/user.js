const mongoose = require("mongoose");
const subscriber = require("../models/subscriber");
const passportLocalMongoose = require("passport-local-mongoose");
const randToken = require("rand-token");

const userSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    zipCode: {
      type: Number,
    },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Course",
      },
    ],
    subscribedAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function (next) {
  if (this.subscribedAccount === undefined) {
    subscriber
      .findOne({
        email: this.email,
      })
      .then((s) => {
        console.log(s);
        if (s) this.subscribedAccount = s;
        next();
      })
      .catch((error) => {
        console.log(`error in connecting subscriber ${error.message}`);
      });
  } else {
    next();
  }
  next();
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);
