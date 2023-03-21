const mongoose = require("mongoose");

const locationSchema = mongoose.Schema(
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
    perentlocation: {
        type: String,
      },
    description: {
      type: String,
    },
    locationIcon: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Location", locationSchema);
