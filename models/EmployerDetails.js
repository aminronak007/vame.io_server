const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const employerDetailsSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    displayname: {
      type: String,
    },
    email: {
      type: String,
    },
    tagline: {
      type: String,
    },
    phone: {
      type: Number,
    },
    companyname: {
      type: String,
    },
    foundedYear: {
      type: Date,
    },
    companyDescription: {
      type: String,
    },
    profilephoto: {
      type: String,
    },
    brohcure: {
      type: String,
    },
    department: {
      type: String,
    },
    noofemployees: {
      type: String,
    },
    location: {
      type: String,
    },
    socialprofile: {
      type: Array,
    },
    billingDetails: {
      firstname: String,
      lastname: String,
      companyName: String,
      address: String,
      country: String,
      city: String,
      zipcode: String,
      billingEmail: String,
      billingNumber: String,
    },

    message: {
      type: Array,
    },
    savedJobs: {
      jobs: [
        {
          type: ObjectId,
          ref: "FreelancerDetails",
          required: true,
        },
      ],
    },
    coursesEnrolled: [
      {
        courseId: {
          type: ObjectId,
          ref: "Courses",
        },
        quiz: {
          quizId: {
            type: ObjectId,
            ref: "Quizzes",
          },
          quizContent: [
            {
              questionId: {
                type: ObjectId,
                ref: "Quizzes",
              },
              answer: {
                type: String,
              },
              checkAnswer: {
                type: Boolean,
              },
            },
          ],
          quizStatus: {
            type: Boolean,
          },
          quizMarks: {
            type: Number,
          },
          quizCompletedDate: {
            type: Date,
          },
        },
        courseContent: [
          {
            contentId: {
              type: ObjectId,
              ref: "Courses",
            },
            contentStatus: {
              type: Boolean,
            },
          },
        ],
      },
    ],
    purchaseCourses: [
      {
        courseId: {
          type: ObjectId,
          ref: "Courses",
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
    ],

    projectPaymentDetails: [
      {
        jobId: {
          type: ObjectId,
          ref: "JobPost",
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
    ],

    ratings: [
      {
        jobId: {
          type: ObjectId,
          ref: "JobPost",
        },
        ratings: {
          type: Number,
        },
        description: {
          type: String,
        },
        freelancerId: {
          type: ObjectId,
          ref: "FreelancerDetails",
        },
        date: {
          type: Date,
        },
      },
    ],

    chats: [
      {
        members: {
          type: Array,
        },
        message: {
          type: String,
        },
        sender: {
          type: String,
        },
      },
    ],

    notifications: [
      {
        notificationType: {
          type: String,
        },
        notificationMessage: {
          type: String,
        },
        timeDate: {
          type: Date,
        },
        seen: {
          type: Boolean,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("EmployerDetails", employerDetailsSchema);
