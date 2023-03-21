const mongoose = require("mongoose");

const cetegorySchema = mongoose.Schema(
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
    perentCategory: {
      type: String,
    },
    description: {
      type: String,
    },
    categoryIcon: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", cetegorySchema);
