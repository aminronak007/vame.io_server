const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const coursesSchema = mongoose.Schema(
  {
    courseCategory: {
      type: ObjectId,
      ref: "CourseCategories",
    },
    courseTitle: {
      type: String,
    },
    courseDescription: {
      type: String,
    },
    courseContent: [
      {
        contentTopic: {
          type: String,
        },
        url: {
          type: String,
        },
        slug: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    freelancersEnrolled: [
      {
        freelancerId: {
          type: ObjectId,
          ref: "FreelancerDetails",
        },
        isEnrolled: {
          type: Boolean,
        },
      },
    ],
    employersEnrolled: [
      {
        employerId: {
          type: ObjectId,
          ref: "EmployerDetails",
        },
        isEnrolled: {
          type: Boolean,
        },
      },
    ],
    feature: {
      type: String,
    },
    price: {
      type: Number,
    },
    courseImageUrl: {
      type: String,
    },
    slug: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courses", coursesSchema);
