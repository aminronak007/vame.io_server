const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const groupsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    autherId: {
      type: ObjectId,
      ref: "Users",
    },
    groupCourse: {
      type: String,
    },
    groupMembers: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Groups", groupsSchema);
