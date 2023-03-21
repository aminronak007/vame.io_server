const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    startas: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    account: {
      type: Boolean,
    },
    hourRate: {
      type: Boolean,
    },
    projectNotification: {
      type: Boolean,
    },
    notificationEmail: {
      type: String,
    },
    login: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Users", userSchema);
