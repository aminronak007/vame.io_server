const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const jobpostSchema = mongoose.Schema(
  {
    jobtitle: {
      type: String,
      required: true,
    },
    jobdescription: {
      type: String,
      required: true,
    },
    englishlevel: {
      type: String,
    },
    experience: {
      type: String,
      required: true,
    },
    fulltime: {
      type: String,
      required: true,
    },
    hourrate: {
      type: String,
      required: true,
    },
    dailyrate: {
      type: String,
      required: true,
    },
    jobcategory: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    skills: {
      type: Array,
    },
    file: {
      type: String,
    },
    faq: {
      type: Array,
    },
    email: {
      type: String,
    },
    slug: {
      type: String,
    },
    assign: {
      type: Boolean,
    },
    projectStatus: {
      projectDurationHours: {
        type: Number,
      },
      fixedPrice: {
        type: Number,
      },
      freelancerStatus: {
        status: String,
      },
      employerStatus: {
        status: String,
      },
      proStatus: {
        status: String,
      },
      paymentDetails: {
        employerId: {
          type: ObjectId,
          ref: "EmployerDetails",
        },
        orderId: {
          type: Number,
        },
        orderDate: {
          type: Date,
        },
        transactionDetails: {
          type: Object,
        },
      },
      releasePaymentStatus: {
        type: Boolean,
      },
      freelancerBankDetails: {
        type: Object,
      },
      freelancerPaymentStatus: {
        type: String,
      },
      assignedFreelancer: {
        type: ObjectId,
        ref: "FreelancerDetails",
      },
    },
    ratings: {
      freelancerRatingsToEmployer: {
        ratings: {
          type: Number,
        },
        freelancerId: {
          type: ObjectId,
          ref: "FreelancerDetails",
        },
        reviews: {
          type: String,
        },
      },
      employerRatingsToFreelancer: {
        ratings: {
          type: Number,
        },
        employerId: {
          type: ObjectId,
          ref: "EmployerDetails",
        },
        reviews: {
          type: String,
        },
      },
    },
    user: { type: ObjectId, ref: "Users", required: true },

    sendInvitation: {
      freelancerId: {
        type: ObjectId,
        ref: "FreelancerDetails",
      },
      freelancerAcceptStatus: {
        type: Boolean,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("JobPost", jobpostSchema);
