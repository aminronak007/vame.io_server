const mongoose = require("mongoose");

const groupsCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    perentgroups: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("GroupsCategory", groupsCategorySchema);
