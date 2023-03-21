const FreelancerDetails = require("../models/freelancerDetails");
const JobPost = require("../models/jobpost");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const FreelancerDeleteDetails = require("../models/FreelancerDeletedAccount");
const FreelancerDeletedAccount = require("../models/FreelancerDeletedAccount");
const Courses = require("../models/Courses");
const Quizzes = require("../models/Quizzes");
const EmployerDetails = require("../models/EmployerDetails");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "suryarathod315@gmail.com",
    pass: "dbrcksiitjnpjdjz",
  },
});

exports.readFreelancerDetails = async (req, res) => {
  try {
    // console.log(req.body);
    const { email } = req.body;

    const freelancerDetails = await FreelancerDetails.findOne({
      email: email,
    })
      .populate("assignProjects.jobId")
      .populate("purchaseCourses.courseId")
      .populate("invitations.jobId")
      .lean();

    res.json({ freelancerDetails });
  } catch (err) {
    res.status(400).json({ error: "Read Freelancer Details failed." });
  }
};

exports.readFreelancerEnrolledCourses = async (req, res) => {
  try {
    // console.log(req.body);
    const { email } = req.body;

    const freelancerDetails = await FreelancerDetails.findOne({
      email: email,
    })
      .populate("assignProjects.jobId")
      .populate("coursesEnrolled.courseId")
      .populate("purchaseCourses.courseId")
      .lean();

    res.json({ freelancerDetails });
  } catch (err) {
    res.status(400).json({ error: "Read Freelancer Details failed." });
  }
};

exports.updateFreelancerDetails = async (req, res) => {
  try {
    const files = req.files;
    let propic = "";
    let bannerpic = "";
    let resume = "";
    let award = [];

    let { email } = req.body;

    if (email) {
      if (files.propic) {
        propic = files.propic.map((i) => i.path).toString();
      }

      if (files.bannerpic) {
        bannerpic = files.bannerpic.map((i) => i.path).toString();
      }
      if (files.resume) {
        resume = files.resume.map((i) => i.path).toString();
      }
      if (files.awards) {
        award.push(files.awards.map((i) => i.path)).toString();
      }

      const {
        gender,
        firstname,
        lastname,
        displayname,
        maxhour,
        hourrate,
        yearsofexperience,
        phone,
        tagline,
        englishlevel,
        location,
        skills,
        gradeExp,
        jobDetails,
        educationDetails,
        videoUrl,
        social,
        awardDetails,
        faq,
      } = req.body;

      if (!displayname)
        return await res.json({
          error: "Display Name should be Mandatory",
        });

      if (!hourrate)
        return res.json({ error: "Hour Rate should be Mandatory" });

      if (!englishlevel)
        return res.json({ error: "English Level should be Mandatory" });

      const jobDetailArr = await JSON.parse(jobDetails);
      const educationDetailArr = await JSON.parse(educationDetails);

      const socialProfileArr = JSON.parse(social);
      const faqArr = await JSON.parse(faq);

      const skillArr = await JSON.parse(skills);

      let awardDetailsArr = await JSON.parse(awardDetails);
      let adetail = [];

      adetail.push({
        awardDegreeTitle: awardDetailsArr
          .map((i) => i.awardDegreeTitle)
          .toString(),

        date: awardDetailsArr.map((i) => i.date).toString(),
        awardUrl: award.map((i) => i).toString(),
      });

      const freelancerDetail = await FreelancerDetails.findOneAndUpdate(
        { email: email },
        {
          gender: gender,
          firstname: firstname,
          lastname: lastname,
          displayname: displayname,
          hourrate: hourrate,
          dailyrate: maxhour,
          yearsofexperience: yearsofexperience,
          phone: phone,
          tagline: tagline,
          englishLevel: englishlevel,
          location: location,
          skills: skillArr,
          profilephoto: req.body.propic ? req.body.propic : propic,
          bannerphoto: req.body.bannerpic ? req.body.bannerpic : bannerpic,
          resume: req.body.resume ? req.body.resume : resume,
          gradeofexperience: gradeExp,
          experienceDetails: jobDetailArr,
          educationDetails: educationDetailArr,
          awardDetails: adetail,
          faq: faqArr,
          profilevideo: videoUrl,
          socialprofile: socialProfileArr,
          notificationEmail: email,
        }
      ); // Creating New Freelancer Details

      await freelancerDetail.save((error) => {
        if (error) {
          res.json({ error });
        } else {
          res.json({
            success: "Your Details has been Updated Successfully !!!",
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ error: "Update Freelancer Details failed." });
  }
};

exports.userManageAccount = async (req, res) => {
  try {
    const { email, account, hourRate, projectNotification } = req.body;

    await User.findOneAndUpdate(
      { email: email },
      {
        account,
        hourRate,
        projectNotification,
      }
    );
    res.json({ success: "Account settings Updated" });
  } catch (err) {
    res.status(400).json({ error: "Account Settings failed." });
  }
};

exports.getFreelancerDetails = async (req, res) => {
  try {
    const { curr } = req.body;
    let limit = 5;
    const freelancerDetails = await FreelancerDetails.find()
      .limit(limit)
      .skip(curr * limit)
      .lean();

    const totalDocs = await FreelancerDetails.find().lean();
    let totalPages = Math.ceil(totalDocs.length / limit);

    res.json({ freelancerDetails, totalPages, curr });
  } catch (err) {
    res.status(400).json({ error: "Account Settings failed." });
  }
};

exports.getFreelancerVideos = async (req, res) => {
  try {
    const freelancerDetails = await FreelancerDetails.find().lean();

    res.json({ freelancerDetails });
  } catch (err) {
    res.status(400).json({ error: "Account Settings failed." });
  }
};

exports.updateBillingDetails = async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
      companyname,
      address,
      country,
      city,
      zipcode,
      billingNumber,
      billingEmail,
    } = req.body;

    const updateBillDetails = await FreelancerDetails.findOneAndUpdate(
      {
        email,
      },
      {
        $set: {
          billingDetails: {
            firstname: firstname,
            lastname: lastname,
            companyName: companyname,
            address: address,
            country: country,
            city: city,
            zipcode: zipcode,
            billingNumber: billingNumber,
            billingEmail: billingEmail,
          },
        },
      }
    );
    if (updateBillDetails) {
      res.json({ success: "Billing Details has been Updated" });
    } else {
      res.json({ error: "Billing Details has not been Updated" });
    }
  } catch (err) {
    res.status(400).json({ error: "Update Billing Details failed." });
  }
};

exports.updateNotificationEmail = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, notificationEmail } = req.body;

    const verifyEmail = await User.findOne({
      notificationEmail,
    }).lean();

    // console.log(verifyEmail);

    if (verifyEmail !== null) res.json({ error: "Email is already in Use..." });

    const updateNotificationEmail = await User.findOneAndUpdate(
      { email },
      { notificationEmail }
    ).lean();

    // console.log(updateNotificationEmail);

    if (updateNotificationEmail) {
      res.json({ success: "Notification Email has been Updated" });
    } else {
      res.json({ error: "Notification Email has not been Updated" });
    }
  } catch (err) {
    res.status(400).json({ error: "Update Notification Email failed." });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { email, password, retypePassword, reasonToLeave, description } =
      req.body;

    if (password !== retypePassword)
      return res.json({ error: "Please provide valid password" });

    const deleteAccount = await User.findOneAndDelete({ email });
    const deleteAccount1 = await FreelancerDetails.findOneAndDelete({
      email,
    });

    if (deleteAccount && deleteAccount1) {
      res.json({ success: "Account has been deleted Successfully" });
    } else {
      res.json({ error: "Account has not been deleted !!!" });
    }
  } catch (err) {
    res.status(400).json({ error: "Delete Account failed." });
  }
};

exports.readSingleFreelancer = async (req, res) => {
  try {
    // console.log(req.params);
    const readFreelancerDetails = await FreelancerDetails.find({
      _id: req.params.id,
    })
      .populate("ratings.jobId")
      .populate("ratings.employerId")
      .populate({
        path: "coursesEnrolled",
        populate: {
          path: "courseId",
          populate: {
            path: "courseCategory",
            model: "CourseCategories",
          },
        },
      })
      .lean();
    res.json({ readFreelancerDetails });
  } catch (err) {
    res.status(400).json({
      error: "Read Single Freelancer Details failed.",
    });
  }
};

exports.hourRateAndEnglishLevelFilter = async (req, res) => {
  try {
    const { hurlyRateFilter, englishLevelFilter } = req.body;
    // console.log(hurlyRateFilter);
    let filterOne = [];
    let filterTwo = [];
    let filterThree = [];
    let filterFour = [];

    if (
      hurlyRateFilter.one &&
      hurlyRateFilter.two &&
      hurlyRateFilter.three &&
      hurlyRateFilter.four
    ) {
      if (hurlyRateFilter.two) {
        const hourRateStartRange = hurlyRateFilter.two.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        if (hs === 2) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });

          filterOne = filter1;
        }
      }
      if (hurlyRateFilter.one) {
        const hourRateStartRange = hurlyRateFilter.one.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        if (hs === 1) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });

          filterTwo = filter1;
        }
      }
      if (hurlyRateFilter.three) {
        const hourRateStartRange = hurlyRateFilter.three.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        if (hs === 3) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });

          filterThree = filter1;
        }
      }
      if (hurlyRateFilter.four) {
        const hourRate = parseInt(hurlyRateFilter.four);

        filterFour = await FreelancerDetails.find({
          hourrate: { $gte: hourRate },
        });
      }

      let filterOne_two = filterOne.concat(filterTwo);
      let filterThree_four = filterThree.concat(filterFour);

      let filterData = filterOne_two.concat(filterThree_four);
      res.json({ filterData });
    }

    if (hurlyRateFilter.two && hurlyRateFilter.three && hurlyRateFilter.four) {
      if (hurlyRateFilter.two) {
        const hourRateStartRange = hurlyRateFilter.two.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.two.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 2 || he === 3) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterOne = filter1.concat(filter2);
        }
      }
      if (hurlyRateFilter.four) {
        const hourRate = parseInt(hurlyRateFilter.four);

        filterFour = await FreelancerDetails.find({
          hourrate: { $gte: hourRate },
        });
      }

      let filterOne_two = filterOne.concat(filterThree);

      let filterData = filterOne_two.concat(filterFour);
      res.json({ filterData });
    }

    if (hurlyRateFilter.one && hurlyRateFilter.three && hurlyRateFilter.four) {
      if (hurlyRateFilter.one) {
        const hourRateStartRange = hurlyRateFilter.one.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.one.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 1 || he === 2) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterTwo = filter1.concat(filter2);
        }
      }
      if (hurlyRateFilter.three) {
        const hourRateStartRange = hurlyRateFilter.three.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        if (hs === 3) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });

          filterThree = filter1;
        }
      }
      if (hurlyRateFilter.four) {
        const hourRate = parseInt(hurlyRateFilter.four);

        filterFour = await FreelancerDetails.find({
          hourrate: { $gte: hourRate },
        });
      }

      let filterOne_two = filterThree.concat(filterTwo);

      let filterData = filterOne_two.concat(filterFour);
      res.json({ filterData });
    }

    if (hurlyRateFilter.one && hurlyRateFilter.two && hurlyRateFilter.three) {
      if (hurlyRateFilter.one) {
        const hourRateStartRange = hurlyRateFilter.one.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.one.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 1 || he === 2) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterTwo = filter1.concat(filter2);
        }
      }
      if (hurlyRateFilter.three) {
        const hourRateStartRange = hurlyRateFilter.three.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        if (hs === 3) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });

          filterThree = filter1;
        }
      }

      let filterData = filterTwo.concat(filterThree);
      res.json({ filterData });
    }

    if (hurlyRateFilter.one && hurlyRateFilter.two && hurlyRateFilter.four) {
      if (hurlyRateFilter.one) {
        const hourRateStartRange = hurlyRateFilter.one.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.one.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 1 || he === 2) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterTwo = filter1.concat(filter2);
        }
      }
      if (hurlyRateFilter.four) {
        const hourRate = parseInt(hurlyRateFilter.four);

        filterFour = await FreelancerDetails.find({
          hourrate: { $gte: hourRate },
        });
      }

      let filterData = filterTwo.concat(filterFour);
      res.json({ filterData });
    }

    if (hurlyRateFilter.one && hurlyRateFilter.two) {
      if (hurlyRateFilter.two) {
        const hourRateStartRange = hurlyRateFilter.two.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.two.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 2 || he === 3) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterOne = filter1.concat(filter2);
        }
      }
      if (hurlyRateFilter.one) {
        const hourRateStartRange = hurlyRateFilter.one.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        if (hs === 1) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });

          filterTwo = filter1;
        }
      }

      let filterData = filterOne.concat(filterTwo);
      res.json({ filterData });
    }

    if (hurlyRateFilter.one && hurlyRateFilter.three) {
      if (hurlyRateFilter.one) {
        const hourRateStartRange = hurlyRateFilter.one.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.one.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 1 || he === 2) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterTwo = filter1.concat(filter2);
        }
      }
      if (hurlyRateFilter.three) {
        const hourRateStartRange = hurlyRateFilter.three.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.three.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 3 || he === 4) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterThree = filter1.concat(filter2);
        }
      }

      let filterData = filterTwo.concat(filterThree);
      res.json({ filterData });
    }

    if (hurlyRateFilter.one && hurlyRateFilter.four) {
      if (hurlyRateFilter.one) {
        const hourRateStartRange = hurlyRateFilter.one.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.one.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 1 || he === 2) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterTwo = filter1.concat(filter2);
        }
      }
      if (hurlyRateFilter.four) {
        const hourRate = parseInt(hurlyRateFilter.four);

        filterFour = await FreelancerDetails.find({
          hourrate: { $gte: hourRate },
        });
      }

      let filterData = filterTwo.concat(filterFour);
      res.json({ filterData });
    }

    if (hurlyRateFilter.two && hurlyRateFilter.three) {
      if (hurlyRateFilter.two) {
        const hourRateStartRange = hurlyRateFilter.two.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        if (hs === 2 || he === 3) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          filterOne = filter1;
        }
      }
      if (hurlyRateFilter.three) {
        const hourRateStartRange = hurlyRateFilter.three.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.three.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 3 || he === 4) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterThree = filter1.concat(filter2);
        }
      }

      let filterData = filterOne.concat(filterThree);
      res.json({ filterData });
    }

    if (hurlyRateFilter.two && hurlyRateFilter.four) {
      if (hurlyRateFilter.two) {
        const hourRateStartRange = hurlyRateFilter.two.substr(0, 1);
        const hs = parseInt(hourRateStartRange);

        const hourRateEndRange = hurlyRateFilter.two.substr(5, 1);
        const he = parseInt(hourRateEndRange);

        if (hs === 2 || he === 3) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });
          const filter2 = await FreelancerDetails.find({
            hourrate: he,
          });
          filterOne = filter1.concat(filter2);
        }
      }
      if (hurlyRateFilter.four) {
        const hourRate = parseInt(hurlyRateFilter.four);

        filterFour = await FreelancerDetails.find({
          hourrate: { $gte: hourRate },
        });
      }

      let filterData = filterOne.concat(filterFour);
      res.json({ filterData });
    }

    if (hurlyRateFilter.three && hurlyRateFilter.four) {
      if (hurlyRateFilter.three) {
        const hourRateStartRange = hurlyRateFilter.three.substr(0, 1);
        const hs = parseInt(hourRateStartRange);
        if (hs === 3) {
          const filter1 = await FreelancerDetails.find({
            hourrate: hs,
          });

          filterThree = filter1;
        }
      }
      if (hurlyRateFilter.four) {
        const hourRate = parseInt(hurlyRateFilter.four);

        filterFour = await FreelancerDetails.find({
          hourrate: { $gte: hourRate },
        });
      }

      let filterData = filterThree.concat(filterFour);
      res.json({ filterData });
    }

    if (hurlyRateFilter.four) {
      const hourRate = parseInt(hurlyRateFilter.four);

      const filterData = await FreelancerDetails.find({
        hourrate: { $gte: hourRate },
      });
      res.json({ filterData });
    }

    if (hurlyRateFilter.three) {
      const hourRateStartRange = hurlyRateFilter.three.substr(0, 1);
      const hs = parseInt(hourRateStartRange);

      const hourRateEndRange = hurlyRateFilter.three.substr(5, 1);
      const he = parseInt(hourRateEndRange);

      if (hs === 3 || he === 4) {
        const filter1 = await FreelancerDetails.find({
          hourrate: hs,
        });
        const filter2 = await FreelancerDetails.find({
          hourrate: he,
        });
        const filterData = filter1.concat(filter2);
        res.json({ filterData });
      }
    }

    if (hurlyRateFilter.two) {
      const hourRateStartRange = hurlyRateFilter.two.substr(0, 1);
      const hs = parseInt(hourRateStartRange);

      const hourRateEndRange = hurlyRateFilter.two.substr(5, 1);
      const he = parseInt(hourRateEndRange);

      if (hs === 2 || he === 3) {
        const filter1 = await FreelancerDetails.find({
          hourrate: hs,
        });
        const filter2 = await FreelancerDetails.find({
          hourrate: he,
        });
        const filterData = filter1.concat(filter2);
        res.json({ filterData });
      }
    }

    if (hurlyRateFilter.one) {
      const hourRateStartRange = hurlyRateFilter.one.substr(0, 1);
      const hs = parseInt(hourRateStartRange);

      const hourRateEndRange = hurlyRateFilter.one.substr(5, 1);
      const he = parseInt(hourRateEndRange);

      if (hs === 1 || he === 2) {
        const filter1 = await FreelancerDetails.find({
          hourrate: hs,
        });
        const filter2 = await FreelancerDetails.find({
          hourrate: he,
        });
        const filterData = filter1.concat(filter2);
        res.json({ filterData });
      }
    }

    if (englishLevelFilter) {
      const filterData = await FreelancerDetails.find({
        englishLevel: englishLevelFilter,
      });
      res.json({ filterData });
    }
  } catch (err) {
    res.status(400).json({ error: "Filteration failed." });
  }
};

exports.acceptProject = async (req, res) => {
  try {
    const { numberOfHours } = req.body;

    if (!numberOfHours)
      res.json({
        error: "Please provide number of total hours for project completion.",
      });
    const acceptProject = await JobPost.findOne(
      { _id: req.params.jobId },
      {
        projectStatus: {
          freelancerStatus: {
            status: "In Progress",
          },
        },
      }
    ).lean();

    // console.log(acceptProject);

    if (acceptProject) {
      await JobPost.findOneAndUpdate(
        { _id: req.params.jobId },
        {
          $set: {
            "projectStatus.projectDurationHours": parseInt(numberOfHours),
            "projectStatus.freelancerStatus": {
              status: "In Progress",
            },
            "projectStatus.proStatus": {
              status: "In Progress",
            },
          },
        }
      );
      res.json({ success: "Project Accepted Successfully..." });
    } else {
      res.json({ error: "Accept Project Failed..." });
    }
  } catch (err) {
    res.status(400).json({ error: "Filteration failed." });
  }
};

exports.cancelProject = async (req, res) => {
  const projectRejectedByEmployer = await JobPost.findOne({
    _id: req.params.jobId,
  }).lean();

  if (
    projectRejectedByEmployer.projectStatus.employerStatus === "In Progress" ||
    projectRejectedByEmployer.projectStatus.proStatus === "In Progress"
  ) {
    const jobCancelDetails = await JobPost.findOneAndUpdate(
      { _id: req.params.jobId },
      {
        $set: {
          "projectStatus.freelancerStatus": "Cancelled",
          "projectStatus.proStatus": "Hold",
        },
      }
    ).lean();

    if (jobCancelDetails) {
      await EmployerDetails.findOneAndUpdate(
        { email: projectRejectedByEmployer.email },
        {
          $push: {
            notifications: {
              notificationType: "Project Cancelled",
              notificationMessage: "Freelancer has stop to do your Job Work.",
              timeDate: new Date(),
              seen: false,
            },
          },
        }
      );
      res.json({ success: "Project Rejected Successfully..." });
    } else {
      res.json({ error: "Project Reject Failed..." });
    }
  } else {
    const jobCancelDetails = await JobPost.findOneAndUpdate(
      { _id: req.params.jobId },
      {
        $set: {
          "projectStatus.freelancerStatus": "Cancelled",
          "projectStatus.proStatus": "Cancelled",
        },
      }
    ).lean();

    if (jobCancelDetails) {
      res.json({ success: "Project Rejected Successfully..." });
    } else {
      res.json({ error: "Project Reject Failed..." });
    }
  }
};

exports.projectCompleted = async (req, res) => {
  try {
    const freelancerProjectStatus = await JobPost.findOne({
      _id: req.params.jobId,
    }).lean();

    if (
      freelancerProjectStatus.projectStatus.employerStatus !== "Cancelled" &&
      freelancerProjectStatus.projectStatus.freelancerStatus !== "Cancelled" &&
      freelancerProjectStatus.projectStatus.proStatus !== "Cancelled"
    ) {
      const jobCompletedDetails = await JobPost.findOneAndUpdate(
        { _id: req.params.jobId },
        {
          $set: {
            "projectStatus.freelancerStatus": "Project Successfully Completed",

            "projectStatus.proStatus": "Not Verified by Employer",
          },
        }
      ).lean();
      if (jobCompletedDetails) {
        let mailOptions = {
          from: "suryarathod315@gmail.com",
          to: freelancerProjectStatus.email,
          subject: "Project Completion.",
          html:
            "<h4>Freelancer has successfully completed your Project. Please verify and update the project status to completed.</h4>" +
            "<p>Thanks for using Vame.io</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        await EmployerDetails.findOneAndUpdate(
          { email: freelancerProjectStatus.email },
          {
            $push: {
              notifications: {
                notificationType: "Project Completed",
                notificationMessage:
                  "Freelancer has completed the Project. If you are satisfied with the work then update the job status to completed.",
                timeDate: new Date(),
                seen: false,
              },
            },
          }
        );
        res.json({
          success:
            "Project Completion Status sent for verification successfully",
        });
      }
    } else {
      res.json({
        error: "Project Completion Status not sent for verification",
      });
    }
  } catch (err) {
    res.status(400).json({ error: "Read Category failed." });
  }
};

exports.savedJobs = async (req, res) => {
  try {
    // console.log(req.body);
    const { userEmail, jobId } = req.body;
    const saveJobs = await FreelancerDetails.findOneAndUpdate(
      { email: userEmail },
      {
        $push: {
          "savedJobs.jobs": jobId,
        },
      }
    ).lean();

    if (saveJobs) {
      await res.json({ success: "Job saved Successfully..." });
    }
  } catch (err) {
    res.status(400).json({ error: "Save Jobs Failed..." });
  }
};

exports.readSavedJobs = async (req, res) => {
  try {
    // console.log(req.body);
    const { email } = req.body;
    const readSavedJobs = await FreelancerDetails.findOne({
      email,
    })
      .populate("savedJobs.jobs")
      .lean();

    const savedJobs = readSavedJobs.savedJobs;

    res.json({ savedJobs });
  } catch (err) {
    res.status(400).json({ error: "Read Saved Jobs Failed..." });
  }
};

exports.removeSavedJobs = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, jobId } = req.body;

    const removedSavedJob = await FreelancerDetails.findOneAndUpdate(
      { email },
      { $pull: { "savedJobs.jobs": jobId } }
    );

    if (removedSavedJob !== null) {
      res.json({ success: "Successfully remove from saved items." });
    }
  } catch (err) {
    res.status(400).json({ error: "Remove Save Jobs Failed..." });
  }
};

exports.cancelNotificationEmail = async (req, res) => {
  try {
    // console.log(req.body);
    const { email } = req.body;
    const status = "Cancelled";
    const cancelNotification = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          notificationEmail: status,
        },
      }
    ).lean();
    if (cancelNotification) {
      res.json({ success: "Email notifications has been cancelled..." });
    } else {
      res.json({ error: "Something went Wrong..." });
    }
  } catch (err) {
    res.status(400).json({ error: "Cancel Notifications Failed..." });
  }
};

exports.deleteFreelancerUserAccount = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password, confirmPassword, reason, description } = req.body;
    if (!password || !confirmPassword || !reason)
      return res.json({ error: "Please Provide valid details !!!" });

    if (password !== confirmPassword)
      res.json({ error: "Password does not Matches !!!" });

    const verifyEmail2 = await User.findOne({ email }).lean();

    const pass = await bcrypt.compare(password, verifyEmail2.password);

    if (!pass) return res.json({ error: "Password does not matches !!!" });

    const verifyEmail1 = await FreelancerDetails.findOne({ email }).lean();

    if (pass && verifyEmail1) {
      const deleteFreelancer = await FreelancerDetails.findOneAndDelete({
        email,
      }).lean();
      const hardDelete = await User.findOneAndDelete({ email }).lean();

      if (deleteFreelancer && hardDelete) {
        try {
          const savedDeletedUserDetails = await FreelancerDeleteDetails.create({
            email: email,
            reasonToDelete: reason,
            description: description,
          });

          await savedDeletedUserDetails.save();
          res.json({
            success: "Your Account has been delete permanently",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        res.json({ error: "Unable to delete account..." });
      }
    } else {
      res.json({ error: "Unable to delete account." });
    }
  } catch (err) {
    res.status(400).json({ error: "Delete User Account Failed..." });
  }
};

exports.readDeletedFreelancerUserAccount = async (req, res) => {
  try {
    const deleteFreelancerDetails =
      await FreelancerDeletedAccount.find().lean();

    res.json({ deleteFreelancerDetails });
  } catch (err) {
    res.status(400).json({ error: "Read Delete Employer Users Failed..." });
  }
};

exports.courseEnrollment = async (req, res) => {
  try {
    // console.log(req.body)
    const { freelancerId, email, courseId } = req.body;

    const courseEnrollment = await FreelancerDetails.findOneAndUpdate(
      {
        email,
      },
      {
        $push: {
          coursesEnrolled: {
            courseId: courseId,
          },
          notifications: {
            notificationType: "Course Enrolled",
            notificationMessage:
              "You have successfully enrolled into the course.",
            timeDate: new Date(),
            seen: false,
          },
        },
      }
    );

    if (courseEnrollment) {
      await Courses.findOneAndUpdate(
        { _id: courseId },
        {
          $push: {
            freelancersEnrolled: {
              freelancerId: freelancerId,
              isEnrolled: true,
            },
          },
        }
      );
      res.json({ success: "Enrolled into Course successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: "Course Enrollment Failed.." });
  }
};

exports.markCompletedContentStatus = async (req, res) => {
  try {
    const { courseContentId, contentStatus, courseId, email } = req.body;

    const updateContent = await FreelancerDetails.findOneAndUpdate(
      { email, coursesEnrolled: { $elemMatch: { courseId: courseId } } },
      {
        $push: {
          "coursesEnrolled.$.courseContent": {
            contentId: courseContentId,
            contentStatus: contentStatus,
          },
        },
      }
    );
    if (updateContent) {
      res.json({ success: "Mark Completed Successfully..." });
    } else {
      res.json({ error: "Somthing Went Wrong..." });
    }
  } catch (err) {
    res.status(400).json({ error: "Mark Completed Status Failed" });
  }
};

exports.startQuiz = async (req, res) => {
  try {
    // console.log(req.body);
    const { quizId, email, courseId } = req.body;

    const updateQuizContent = await FreelancerDetails.findOneAndUpdate(
      {
        email,
        coursesEnrolled: { $elemMatch: { courseId: courseId } },
      },
      {
        "coursesEnrolled.$.quiz.quizId": quizId,
        $set: {
          "coursesEnrolled.$.quiz.quizContent": [],
        },
      }
    );
    if (updateQuizContent) {
      res.json({ success: "Quiz Started Successfully..." });
    } else {
      res.json({ error: "Somthing Went Wrong..." });
    }
  } catch {
    res.status(400).json({ error: "Start Quiz Failed...." });
  }
};

exports.quizApply = async (req, res) => {
  try {
    const { questionId, courseId, email, answer } = req.body;

    if (!answer) res.json({ error: "Please select an option..." });

    if (answer) {
      const course = await Quizzes.findOne({
        courseId: courseId,
      });

      let currentQuestion = await course.quizContent.find(
        (e) => e._id.toString() === questionId
      );

      let checkAnswer = (await currentQuestion.rightAnswer) === answer;

      const updateQuizContent = await FreelancerDetails.findOneAndUpdate(
        {
          email,
          coursesEnrolled: { $elemMatch: { courseId: courseId } },
        },
        {
          $push: {
            "coursesEnrolled.$.quiz.quizContent": {
              questionId: questionId,
              answer: answer,
              checkAnswer: checkAnswer,
            },
          },
        }
      );
      if (updateQuizContent) {
        res.json({ success: "Answer Marked Successfully..." });
      } else {
        res.json({ error: "Somthing Went Wrong..." });
      }
    }
  } catch {
    res.status(400).json({ error: "Quiz Applied Failed..." });
  }
};

exports.freelancerSubmitQuiz = async (req, res) => {
  try {
    const { email, courseId, quizId } = req.body;

    const findQuiz = await FreelancerDetails.findOne({
      email: email,
      coursesEnrolled: { $elemMatch: { courseId: courseId } },
    });

    const quiz = await findQuiz.coursesEnrolled.find(
      (i) => i.quiz.quizId.toString() === quizId
    );

    const quizContent = await quiz.quiz.quizContent;

    const correctAnswers = await quizContent
      .map((i, index, elements) => {
        if (i.checkAnswer === true) {
          return elements[index];
        }
      })
      .filter((n) => n).length;

    const submitQuiz = await FreelancerDetails.findOneAndUpdate(
      {
        email: email,
        coursesEnrolled: { $elemMatch: { courseId: courseId } },
      },
      {
        "coursesEnrolled.$.quiz.quizStatus": true,
        "coursesEnrolled.$.quiz.quizMarks": correctAnswers,
        "coursesEnrolled.$.quiz.quizCompletedDate": new Date(),
      }
    );

    if (submitQuiz) {
      let freelancerCoursePassed = await FreelancerDetails.findOne({
        email: email,
        coursesEnrolled: { $elemMatch: { courseId: courseId } },
      }).lean();

      let coursePassed = parseInt(
        freelancerCoursePassed.coursesEnrolled.map(
          (i) => (i.quiz.quizMarks * 100) / i.quiz.quizContent.length
        )
      );

      if (coursePassed > 35) {
        await FreelancerDetails.findOneAndUpdate(
          {
            email: email,
          },
          {
            $push: {
              notifications: {
                notificationType: "Course Completed",
                notificationMessage:
                  "You have successfully completed the course. Please go to course page to download certificate.",
                timeDate: new Date(),
                seen: false,
              },
            },
          }
        );

        let mailOptions = {
          from: "suryarathod315@gmail.com",
          to: email,
          subject: "Course Completed Successfully.",
          html:
            "<h4>Congratulations, you have successfully completed the course. You can now download the certificate from the course page.</h4>" +
            "<p>Thanks for using Vame.io</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
      res.json({
        success: "Quiz Submitted Successfully",
      });
    }
  } catch {
    res.status(400).json({ error: "Submit Quiz Failed..." });
  }
};

exports.resetQuiz = async (req, res) => {
  try {
    // console.log(req.body);
    const { quizId, courseId, email } = req.body;

    const resetQuiz = await FreelancerDetails.findOneAndUpdate(
      {
        email,
        coursesEnrolled: { $elemMatch: { courseId: courseId } },
      },
      {
        "coursesEnrolled.$.quiz.quizId": quizId,
        $set: {
          "coursesEnrolled.$.quiz.quizContent": [],
        },
      }
    );
    if (resetQuiz) {
      res.json({ success: "Quiz Started Successfully..." });
    } else {
      res.json({ error: "Somthing Went Wrong..." });
    }
  } catch {
    res.status(400).json({ error: "Reset Quiz Failed" });
  }
};

exports.addBankAccount = async (req, res) => {
  try {
    const { accountNo, bankName, mobile, routingNumber } = req.body.bankDetails;

    if (!accountNo) {
      res.json({ error: "Please enter Bank Account Number." });
    } else if (!bankName) {
      res.json({ error: "Please enter Bank Name." });
    } else if (!mobile) {
      res.json({
        error: "Please enter registered Mobile Number with your bank account.",
      });
    } else if (!routingNumber) {
      res.json({ error: "Please enter IFSC Code." });
    } else {
      const updateBankDetail = await FreelancerDetails.findOneAndUpdate(
        {
          email: req.body.email,
        },
        {
          $push: {
            bankDetails: {
              accountNo: accountNo,
              bankName: bankName,
              mobile: mobile,
              routingNumber: routingNumber,
            },
          },
        }
      );

      if (updateBankDetail) {
        res.json({
          success: "Bank Details has been added successfully.",
        });
      } else {
        res.json({ error: "Something went wrong..." });
      }
    }
  } catch {
    res.status(400).json({ error: "Add Bank Account Failed..." });
  }
};

exports.applyForPayment = async (req, res) => {
  try {
    const { accountNo, bankName, mobile, routingNumber } =
      req.body.selectedBankAccount;
    const { jobId } = req.body;

    if (!accountNo) return res.json({ error: "Please Select a Bank Account." });

    const applyForPayment = await JobPost.findOneAndUpdate(
      { _id: jobId },
      {
        $set: {
          "projectStatus.releasePaymentStatus": false,
          "projectStatus.freelancerBankDetails": {
            accountNo: accountNo,
            bankName: bankName,
            mobile: mobile,
            routingNumber: routingNumber,
          },
          "projectStatus.freelancerPaymentStatus": "Applied",
        },
      }
    );

    if (applyForPayment) {
      await FreelancerDetails.findOneAndUpdate(
        {
          email: req.body.email,
        },
        {
          $push: {
            notifications: {
              notificationType: "Release Payment",
              notificationMessage:
                "You have successfully applied for the payment. Your amount will be reflected into your bank account in 5-7 Business days.",
              timeDate: new Date(),
              seen: false,
            },
          },
        }
      );
      res.json({ success: "Successfully applied for the payment." });
    }
  } catch {
    res.status(400).json({ error: "Apply for release payment failed.." });
  }
};

exports.rateEmployer = async (req, res) => {
  try {
    const { ratingValue, description, freelancerId, email, jobId } = req.body;
    const date_ob = new Date();

    const addRatings = await EmployerDetails.findOneAndUpdate(
      { email: email },
      {
        $push: {
          ratings: {
            jobId: jobId,
            ratings: ratingValue,
            description: description,
            freelancerId: freelancerId,
            date: date_ob,
          },
        },
      }
    );

    if (addRatings) {
      const addJobRatings = await JobPost.findOneAndUpdate(
        {
          _id: jobId,
        },
        {
          $set: {
            "ratings.freelancerRatingsToEmployer.ratings": ratingValue,
            "ratings.freelancerRatingsToEmployer.freelancerId": freelancerId,
            "ratings.freelancerRatingsToEmployer.reviews": description,
          },
        }
      );

      let mailOptions = {
        from: "suryarathod315@gmail.com",
        to: addRatings.email,
        subject: "Vame.io Ratings",
        html:
          "<h4>Congratulations you received ratings from Freelancer.</h4>" +
          "<p>Thanks for using Vame.io</p>",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.json({ success: "Thanks for rating !!!" });
    } else {
      res.json({
        error: "Something went Wrong !!!. Please try Again later.",
      });
    }
  } catch {
    res.status(400).json({ error: "Rate Employers Failed..." });
  }
};

exports.createChat = async (req, res) => {
  try {
    console.log(req.body);
  } catch {
    res.status(400).json({ error: "Freelancer Send Message Failed" });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const {
      jobId,
      freelancerId,
      noOfHours,
      employerId,
      fixedPrice,
      invitationStatus,
    } = req.body;

    const acceptInvitation = await JobPost.findOneAndUpdate(
      { _id: jobId },
      {
        $set: {
          assign: true,
          projectStatus: {
            projectDurationHours: noOfHours,
            fixedPrice: fixedPrice,
            assignedFreelancer: freelancerId,
            freelancerStatus: "In Progress",
          },
          sendInvitation: {
            freelancerId: freelancerId,
            freelancerAcceptStatus: invitationStatus,
          },
        },
      }
    );

    if (acceptInvitation) {
      const employerEmail = await JobPost.findOne({
        _id: jobId,
      }).lean();

      await FreelancerDetails.findOneAndUpdate(
        {
          _id: freelancerId,
          invitations: {
            $elemMatch: { jobId: jobId },
          },
        },
        {
          $set: {
            "invitations.$.jobId": jobId,
            "invitations.$.employerId": employerId,
            "invitations.$.fixedPrice": fixedPrice,
            "invitations.$.noOfHours": noOfHours,
            "invitations.$.jobAcceptStatus": invitationStatus,
          },
        }
      );

      if (invitationStatus === true) {
        let mailOptions = {
          from: "suryarathod315@gmail.com",
          to: employerEmail.email,
          subject: "Job Invitation Accepted.",
          html:
            "<h4>Freelancer has accepted your Job invitation. Please pay the full amount of the Project.</h4>" +
            "<p>Thanks for using Vame.io</p>",
        };

        await EmployerDetails.findOneAndUpdate(
          { email: employerEmail.email },
          {
            $push: {
              notifications: {
                notificationType: "Offer Accepted",
                notificationMessage:
                  "Freelancer has successfully accepted your Job invitation.",
                timeDate: new Date(),
                seen: false,
              },
            },
          }
        );

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        res.json({ success: "Invitation Accepted Successfully" });
      } else {
        res.json({
          success:
            "Invitation Rejected ! Please wait for the new offer from Employer.",
        });
      }
    }
  } catch {
    res.status(400).json({ error: "Accept Invitation Failed..." });
  }
};

exports.rejectInvitation = async (req, res) => {
  try {
    const {
      jobId,
      freelancerId,
      noOfHours,
      employerId,
      fixedPrice,
      invitationStatus,
    } = req.body;

    const employerEmail = await JobPost.findOne({
      _id: jobId,
    }).lean();

    const rejectInvitation = await JobPost.findOneAndUpdate(
      { _id: jobId },
      {
        $set: {
          assign: false,
          projectStatus: {
            projectDurationHours: noOfHours,
            fixedPrice: fixedPrice,
            assignedFreelancer: freelancerId,
          },
          sendInvitation: {
            freelancerId: freelancerId,
            freelancerAcceptStatus: invitationStatus,
          },
        },
      }
    );

    if (rejectInvitation) {
      await FreelancerDetails.findOneAndUpdate(
        {
          _id: freelancerId,
          invitations: { $elemMatch: { jobId: jobId } },
        },
        {
          $set: {
            "invitations.$.jobId": jobId,
            "invitations.$.employerId": employerId,
            "invitations.$.fixedPrice": fixedPrice,
            "invitations.$.noOfHours": noOfHours,
            "invitations.$.jobAcceptStatus": invitationStatus,
          },
        }
      );

      await EmployerDetails.findOneAndUpdate(
        { email: employerEmail.email },
        {
          $push: {
            notifications: {
              notificationType: "Offer Rejected",
              notificationMessage:
                "Freelancer has rejected your Job invitation. Please send a new offer.",
              timeDate: new Date(),
              seen: false,
            },
          },
        }
      );

      let mailOptions = {
        from: "suryarathod315@gmail.com",
        to: employerEmail.email,
        subject: "Job Invitation Rejected.",
        html:
          "<h4>Freelancer has rejected your Job invitation. Please make a new offer or find new freelancer for your job.</h4>" +
          "<p>Thanks for using Vame.io</p>",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      if (invitationStatus === true) {
        res.json({ success: "Invitation Rejected" });
      } else {
        res.json({
          success:
            "Invitation Rejected ! Please wait for the new offer from Employer.",
        });
      }
    }
  } catch {
    res.status(400).json({ error: "" });
  }
};

exports.notifications = async (req, res) => {
  try {
    const { email } = req.body;

    const freelancerDetails = await FreelancerDetails.findOne({
      email,
    });

    const length = (await freelancerDetails)
      ? freelancerDetails.notifications
          .map((i, index, elements) => {
            if (i.seen === false) {
              return elements[index];
            }
          })
          .filter((n) => n).length
      : null;
    if (length > 0) {
      try {
        for (let i = 0; i < length; i++) {
          await FreelancerDetails.findOneAndUpdate(
            {
              email,
              notifications: { $elemMatch: { seen: false } },
            },
            {
              $set: {
                "notifications.$.seen": true,
              },
            }
          );

          res.json({ success: "Notifications are true" });
        }
      } catch {}
    } else {
      res.json({ success: "Zero Notifications" });
    }
  } catch {
    res.status(400).json({ error: "Notifications Status Failed.." });
  }
};

exports.freelancerBadges = async (req, res) => {
  try {
    const { id } = req.params;

    const freelancerCourse = await FreelancerDetails.findOne({
      _id: id,
    })
      .populate({
        path: "coursesEnrolled",
        populate: {
          path: "courseId",
          populate: {
            path: "courseCategory",
            model: "CourseCategories",
          },
        },
      })
      .lean();

    res.json(freelancerCourse);
  } catch {
    res.status(400).json({ error: "Fetch Freelancer Badges failed..." });
  }
};

exports.freelancerJobInvitations = async (req, res) => {
  try {
    const { email } = req.body;

    FreelancerDetails.findOne({ email })
      .select("invitations")
      .populate("invitations.jobId")
      .exec((err, data) => {
        if (err) {
          console.log(err);
        }
        const invitations = data.invitations
          .map((i, index, elements) => {
            if (i.jobAcceptStatus !== true && i.employerId) {
              return elements[index];
            }
          })
          .filter((n) => n);

        res.json(invitations);
      });
  } catch {
    res.status(400).json({ error: "Something went Wrong !!!" });
  }
};

exports.freelancerJobs = async (req, res) => {
  try {
    const { email } = req.body;

    const freelancerId = await FreelancerDetails.findOne({ email })
      .select("_id")
      .lean();

    JobPost.find({
      "projectStatus.assignedFreelancer": freelancerId,
    }).exec((err, docs) => {
      if (err) {
        console.log(err);
      }

      const currentJobs = docs
        .map((i, index, elements) => {
          if (
            !i.projectStatus.paymentDetails.employerId ||
            i.projectStatus.proStatus.toString() === "In Progress" ||
            i.projectStatus.employerStatus.toString() === "In Progress" ||
            i.projectStatus.proStatus.toString() === "Hold"
          ) {
            return elements[index];
          }
        })
        .filter((n) => n);

      const completedJobs = docs
        .map((i, index, elements) => {
          if (i.projectStatus.proStatus.toString() === "Completed") {
            return elements[index];
          }
        })
        .filter((n) => n);

      const cancelledJobs = docs
        .map((i, index, elements) => {
          if (i.projectStatus.proStatus.toString() === "Cancelled") {
            return elements[index];
          }
        })
        .filter((n) => n);

      res.json({
        currentJobs,
        completedJobs,
        cancelledJobs,
      });
    });
  } catch {
    res.status(400).json({ error: "Something went Wrong !!!" });
  }
};

exports.freelancerNotifications = async (req, res) => {
  try {
    const { email } = req.body;
    FreelancerDetails.findOne({
      email,
      notifications: { $elemMatch: { seen: false } },
    })
      .select("notifications")
      .exec((err, data) => {
        if (err) {
          console.log(err);
        }

        if (data) {
          const notifications = data.notifications.sort(
            (a, b) => new Date(b.timeDate) - new Date(a.timeDate)
          );

          res.json({ notifications });
        }
      });
  } catch {
    res.status(400).json({ error: "Something went Wrong..." });
  }
};

exports.fNotifications = async (req, res) => {
  try {
    const { curr, email } = req.body;

    FreelancerDetails.findOne({ email })
      .select("notifications")
      .exec(async (err, data) => {
        if (err) return console.log(err);

        try {
          const page = await curr;
          const limit = 5;

          // calculating the starting and ending index
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;

          const notifications = {};
          if (endIndex < data.notifications.length) {
            notifications.next = {
              page: page + 1,
              limit: limit,
              totalPages: Math.ceil(data.notifications.length / limit),
            };
          }

          if (startIndex >= 0) {
            notifications.previous = {
              page: page - 1,
              limit: limit,
              totalPages: Math.ceil(data.notifications.length / limit),
            };
          }
          notifications.notifications = await data.notifications.slice(
            startIndex,
            endIndex
          );

          await res.json((paginatedResults = notifications));
        } catch (error) {
          console.log(error);
        }
      });
  } catch {
    res.status(400).json({ error: "Something went Wrong" });
  }
};
