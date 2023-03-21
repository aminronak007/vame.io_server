const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const freelancerDetailsSchema = mongoose.Schema(
  {
    gender: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
    },
    displayname: {
      type: String,
    },
    hourrate: {
      type: Number,
    },
    dailyrate: {
      type: Number,
    },
    yearsofexperience: {
      type: Number,
    },
    phone: {
      type: Number,
    },
    tagline: {
      type: String,
    },
    englishLevel: {
      type: String,
    },
    profilephoto: {
      type: String,
    },
    bannerphoto: {
      type: String,
    },
    resume: {
      type: String,
    },
    location: {
      type: String,
    },
    skills: {
      type: Array,
    },
    gradeofexperience: {
      type: Number,
    },

    experienceDetails: {
      type: Array,
    },

    educationDetails: {
      type: Array,
    },
    awardDetails: {
      type: Array,
    },
    profilevideo: {
      type: String,
    },
    socialprofile: {
      type: Object,
    },
    faq: {
      type: Array,
    },
    billingDetails: [
      {
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
    ],
    assignProjects: [
      {
        jobId: {
          type: ObjectId,
          ref: "JobPost",
          required: true,
        },
        assign: Boolean,
      },
    ],
    savedJobs: {
      jobs: [
        {
          type: ObjectId,
          ref: "JobPost",
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
    bankDetails: [
      {
        accountNo: {
          type: Number,
        },
        bankName: {
          type: String,
        },
        mobile: {
          type: Number,
        },
        routingNumber: {
          type: Number,
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
        employerId: {
          type: ObjectId,
          ref: "EmployerDetails",
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

    invitations: [
      {
        jobId: {
          type: ObjectId,
          ref: "JobPost",
        },
        employerId: {
          type: ObjectId,
          ref: "EmployerDetails",
        },
        seen: {
          type: Boolean,
        },
        fixedPrice: {
          type: Number,
        },
        noOfHours: {
          type: Number,
        },
        jobAcceptStatus: {
          type: Boolean,
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
module.exports = mongoose.model("FreelancerDetails", freelancerDetailsSchema);
