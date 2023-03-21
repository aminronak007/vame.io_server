const EmployerDetails = require("../models/EmployerDetails");
const JobPost = require("../models/jobpost");
const Freelancer = require("../models/freelancerDetails");
const User = require("../models/user");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const EmployerDeleteDetails = require("../models/EmployerDeletedAccounts");
const EmployerDeletedAccounts = require("../models/EmployerDeletedAccounts");
const Courses = require("../models/Courses");
const Quizzes = require("../models/Quizzes");
const orderid = require("order-id")("key");
const id = orderid.generate();
const axios = require("axios");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "suryarathod315@gmail.com",
    pass: "dbrcksiitjnpjdjz",
  },
});

exports.readEmployerDetails = async (req, res) => {
  try {
    const { email } = req.body;
    const employerDetails = await EmployerDetails.findOne({
      email: email,
    })
      .populate("ratings.jobId")
      .populate("purchaseCourses.courseId")
      .populate("ratings.freelancerId")
      .lean();

    res.json({ employerDetails });
  } catch (err) {
    res.status(400).json({ error: "Read Employer Details failed." });
  }
};

exports.readEmployerEnrolledCourses = async (req, res) => {
  try {
    // console.log(req.body);
    const { email } = req.body;

    const employerDetails = await EmployerDetails.findOne({
      email: email,
    })
      .populate("coursesEnrolled.courseId")
      .populate("purchaseCourses.courseId")
      .lean();

    res.json({ employerDetails });
  } catch (err) {
    res.status(400).json({ error: "Read Freelancer Details failed." });
  }
};

exports.readSingleEmployer = async (req, res) => {
  try {
    const readEmployerDetails = await EmployerDetails.find({
      _id: req.params.id,
    })
      .populate("ratings.freelancerId")
      .lean();
    res.json({ readEmployerDetails });
  } catch (err) {
    res.status(400).json({
      error: "Read Single Freelancer Details failed.",
    });
  }
};

exports.updateEmployerDetails = async (req, res) => {
  try {
    const files = req.files;

    let propic = "";
    let brochure = "";

    let { email } = req.body;

    if (email) {
      if (files.employeepropic) {
        propic = await files.employeepropic.map((i) => i.path).toString();
      }
      if (files.brochure) {
        brochure = files.brochure.map((i) => i.path).toString();
      }
      const {
        firstname,
        lastname,
        displayname,
        phone,
        tagline,
        companyname,
        jobtitle,
        department,
        employees,
        location,
        social,
        jobdescription,
      } = req.body;

      if (!displayname)
        return await res.json({
          error: "Display Name should be Mandatory",
        });

      const socialProfileArr = JSON.parse(social);

      const employerDetail = await EmployerDetails.findOneAndUpdate(
        { email: email },
        {
          firstname: firstname,
          lastname: lastname,
          displayname: displayname,
          phone: phone,
          tagline: tagline,
          companyname: companyname,
          foundedYear: jobtitle,
          companyDescription: jobdescription,
          profilephoto: propic,
          department: department,
          noofemployees: employees,
          location: location,
          brohcure: brochure,
          socialprofile: socialProfileArr,
          notificationEmail: email,
        }
      ); // Creating New Employer Details

      await employerDetail.save((error) => {
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
    res.status(400).json({ error: "Update Employer Details failed." });
  }
};

exports.jobPost = async (req, res) => {
  try {
    let file = req.file;
    let path = "";
    if (file) {
      path = file.path;
    }

    const {
      jobtitle,
      englishLevel,
      yearofexperience,
      price,
      hourrate,
      dailyrate,
      selectCategory,
      date,
      skills,
      faqlist,
      email,
      jobdescription,
      current_userID,
    } = req.body;

    if (!jobtitle) return res.json({ error: "Job title Required !!!" });
    if (!yearofexperience)
      return res.json({
        error: "Select Year of Experience Preferred Required !!!",
      });
    if (!price) return res.json({ error: "Select Time Required !!!" });
    if (!hourrate) return res.json({ error: "Hour Rate Required !!!" });
    if (hourrate < 0)
      return res.json({
        error: "Hour Rate should be greater than 0 !!!",
      });
    if (!dailyrate) return res.json({ error: "Daily Rate Required !!!" });
    if (dailyrate < 0)
      return res.json({
        error: "Daily Rate should be greater than 0 !!!",
      });
    if (!selectCategory)
      return res.json({ error: "Select Category Required !!!" });
    if (!jobdescription)
      return res.json({ error: "Job description Required !!!" });
    if (!skills) return res.json({ error: "Select Skill Required !!!" });

    const faqlists = JSON.parse(faqlist);
    const skill = JSON.parse(skills);

    const verifyjobtitle = await JobPost.find({ jobtitle }).lean();
    let slug = "";
    if (verifyjobtitle) {
      slug = slugify(jobtitle + "-" + verifyjobtitle.length).toLowerCase();
    }

    const jobPostDetails = await JobPost.create({
      jobtitle: jobtitle,
      englishlevel: englishLevel,
      experience: yearofexperience,
      fulltime: price,
      hourrate: hourrate,
      dailyrate: dailyrate,
      jobcategory: selectCategory,
      date: date,
      skills: skill,
      file: path,
      faq: faqlists,
      slug: slug === "" ? slugify(jobtitle).toLowerCase() : slug,
      email: email,
      jobdescription: jobdescription,
      user: current_userID,
      assign: false,
    }); // Creating New Job Post

    await jobPostDetails.save((error) => {
      if (error) {
        res.json({ error });
      } else {
        let mailOptions = {
          from: "suryarathod315@gmail.com",
          to: email,
          subject: "Post a Job.",
          html:
            "<h4> You have successsfully post a job on vame.io</h4>" +
            "<p>Thanks for using Vame.io</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        res.json({
          success: "Your Post has been Posted Successfully !!!",
        });
      }
    });
  } catch (err) {
    res.status(400).json({ error: "Create Job Post Details failed." });
  }
};

exports.editJobPost = async (req, res) => {
  try {
    let file = req.file;
    let path = "";
    if (file) {
      path = file.path;
    }

    const {
      jobtitle,
      englishLevel,
      yearofexperience,
      price,
      hourrate,
      dailyrate,
      selectCategory,
      date,
      skills,
      faqlist,
      email,
      jobdescription,
      current_userID,
    } = req.body;

    if (!jobtitle) return res.json({ error: "Job title Required !!!" });
    if (!yearofexperience)
      return res.json({
        error: "Select Year of Experience Preferred Required !!!",
      });
    if (!price) return res.json({ error: "Select Time Required !!!" });
    if (!hourrate) return res.json({ error: "Hour Rate Required !!!" });
    if (!dailyrate) return res.json({ error: "Daily Rate Required !!!" });
    if (!selectCategory)
      return res.json({ error: "Select Category Required !!!" });
    if (!jobdescription)
      return res.json({ error: "Job description Required !!!" });
    if (!skills) return res.json({ error: "Select Skill Required !!!" });

    const faqlists = JSON.parse(faqlist);

    const editJobPostDetails = await JobPost.findByIdAndUpdate(
      { _id: req.params.id },
      {
        jobtitle: jobtitle,
        englishlevel: englishLevel,
        experience: yearofexperience,
        fulltime: price,
        hourrate: hourrate,
        dailyrate: dailyrate,
        jobcategory: selectCategory,
        date: date,
        skills: skills,
        file: path,
        faq: faqlists,
        slug: slugify(jobtitle).toLowerCase(),
        email: email,
        jobdescription: jobdescription,
        user: current_userID,
      }
    );

    if (editJobPostDetails) {
      res.json({ success: "Job details updated successfully..." });
    } else {
      res.json({ error: "Update Job Details Failed..." });
    }
  } catch (err) {
    res.status(400).json({ error: "Edit Jobpost Failed..." });
  }
};

exports.userManageAccount = async (req, res) => {
  try {
    const { email, account, projectNotification } = req.body;
    await User.findOneAndUpdate(
      { email: email },
      {
        account,
        projectNotification,
      }
    );
    res.json({ success: "Account settings Updated" });
  } catch (err) {
    res.status(400).json({ error: "Account Settings failed." });
  }
};

exports.getEmployerDetails = async (req, res) => {
  try {
    const employerDetails = await EmployerDetails.find().lean();
    res.json({ employerDetails });
  } catch (err) {
    res.status(400).json({ error: "Read Employer details failed." });
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

    // console.log(req.body);
    const updateBillDetails = await EmployerDetails.findOneAndUpdate(
      {
        email,
      },
      {
        $set: {
          billingDetails: [
            {
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
          ],
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
    const { email, notificationEmail } = req.body;
    const verifyEmail = await User.findOne({
      notificationEmail,
    }).lean();

    if (verifyEmail !== null) res.json({ error: "Email is already in Use..." });

    const updateNotificationEmail = await User.findOneAndUpdate(
      { email },
      { notificationEmail }
    );

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
    const deleteAccount1 = await EmployerDetails.findOneAndDelete({
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

exports.acceptproject = async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.params);

    const { assign } = req.body;
    // console.log(assign);
    const jobDetails = await JobPost.findOneAndUpdate(
      { slug: req.params.slug },
      { assign }
    ).lean();

    res.json({ jobDetails });
  } catch (err) {
    res.status(400).json({ error: "List Jobs failed." });
  }
};

exports.listJobs = async (req, res) => {
  try {
    const { curr } = req.body;
    let limit = 5;

    const jobDetails = await JobPost.find({ assign: false })
      .populate("user")
      .populate("projectStatus.paymentDetails.employerId")
      .limit(limit)
      .skip(curr * limit)
      .lean();

    const totalDocs = await JobPost.find({ assign: false }).lean();

    let totalPages = Math.ceil(totalDocs.length / limit);

    res.json({ jobDetails, totalPages, curr });
  } catch (err) {
    res.status(400).json({ error: "List Jobs failed." });
  }
};

exports.readSingleJobs = async (req, res) => {
  try {
    const readJobDetails = await JobPost.find({
      slug: req.params.slug,
    })
      .populate("user")
      .lean();
    res.json({ readJobDetails });
  } catch (err) {
    res.status(400).json({ error: "Read Single Jobs failed." });
  }
};

exports.readJobById = async (req, res) => {
  try {
    const readJobDetails = await JobPost.findOne({
      _id: req.params.id,
    })
      .populate("user")
      .lean();
    res.json({ readJobDetails });
  } catch {
    res.status(400).json({ error: "Read jobs by id failed..." });
  }
};

exports.readCategoryWiseData = async (req, res) => {
  try {
    const { category } = req.body;
    const jobDetails = await JobPost.find({ jobcategory: category });

    if (jobDetails) {
      res.json({ jobDetails });
    } else {
      res.json({ success: "No Data" });
    }
  } catch (err) {
    res.status(400).json({ error: "Read Category failed." });
  }
};

exports.employerJobs = async (req, res) => {
  try {
    const { email } = req.body;
    const jobDetails = await JobPost.find({ email });

    res.json({ jobDetails });
  } catch (err) {
    res.status(400).json({ error: "List Jobs failed." });
  }
};

exports.assignProjects = async (req, res) => {
  try {
    const { email, assign, jobId } = req.body;

    const verifyEmail = await Freelancer.findOne({ email }).lean();
    if (!verifyEmail)
      res.json({
        error: "This email does not match the freelancer email",
      });

    const jobAssigned = await Freelancer.findOne({
      "assignProjects.jobId": jobId,
    });

    if (jobAssigned) {
      res.json({ success: "Already Project Assigned" });
    }

    if (!jobAssigned && verifyEmail) {
      const assignProjectDetails = await Freelancer.findOneAndUpdate(
        { email },
        {
          $push: {
            assignProjects: {
              jobId,
              assign,
            },
          },
        }
      ).lean();

      if (assignProjectDetails) {
        await JobPost.findOneAndUpdate(
          { _id: jobId },
          {
            $set: {
              assign,
              projectStatus: {
                employerStatus: {
                  status: "In Progress",
                },
              },
            },
          }
        );
        res.json({
          success: "Project Assigned to Freelancer",
          assignProjectDetails,
        });
      } else {
        res.json({ success: "No Data" });
      }
    }
  } catch (err) {
    res.status(400).json({ error: "Read Category failed." });
  }
};

exports.cancelProjects = async (req, res) => {
  const { assign } = req.body;

  const projectRejectedByFreelancer = await JobPost.findOne({
    _id: req.params.jobId,
  }).lean();

  if (
    projectRejectedByFreelancer.projectStatus.freelancerStatus ===
      "In Progress" ||
    projectRejectedByFreelancer.projectStatus.proStatus === "In Progress"
  ) {
    const jobCancelDetails = await JobPost.findOneAndUpdate(
      { _id: req.params.jobId },
      {
        assign: assign,
        $set: {
          "projectStatus.employerStatus": "Cancelled",
          "projectStatus.proStatus": "Hold",
        },
      }
    ).lean();
    if (jobCancelDetails) {
      await Freelancer.findOneAndUpdate(
        { _id: projectRejectedByFreelancer.projectStatus.assignedFreelancer },
        {
          $push: {
            notifications: {
              notificationType: "Project Cancelled",
              notificationMessage: "Employer has cancelled the Project.",
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
          "projectStatus.employerStatus": "Cancelled",
          "projectStatus.proStatus": "Cancelled",
        },
      }
    ).lean();
    if (jobCancelDetails) {
      await Freelancer.findOneAndUpdate(
        { _id: projectRejectedByFreelancer.projectStatus.assignedFreelancer },
        {
          $push: {
            notifications: {
              notificationType: "Project Cancelled",
              notificationMessage: "Employer has cancelled the Project.",
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
  }
};

exports.projectCompleted = async (req, res) => {
  // console.log(req.params);
  try {
    const freelancerProjectStatus = await JobPost.findOne({
      _id: req.params.jobId,
    })
      .populate("projectStatus.assignedFreelancer")
      .lean();

    if (
      freelancerProjectStatus.projectStatus.freelancerStatus !== "Cancelled" &&
      freelancerProjectStatus.projectStatus.freelancerStatus !==
        "In Progress" &&
      freelancerProjectStatus.projectStatus.proStatus !== "Cancelled"
    ) {
      const jobCompletedDetails = await JobPost.findOneAndUpdate(
        { _id: req.params.jobId },
        {
          $set: {
            "projectStatus.employerStatus": "Project Successfully Completed",
            "projectStatus.proStatus": "Completed",
          },
        }
      ).lean();
      if (jobCompletedDetails) {
        let mailOptions = {
          from: "suryarathod315@gmail.com",
          to: freelancerProjectStatus.projectStatus.assignedFreelancer.email,
          subject: "Project Completion.",
          html:
            "<h4>Employer has successfully verified your Project. You can now apply to release your payment. </h4>" +
            "<h3>Please also give raitings and reviews to Employer.</h3>" +
            "<p>Thanks for using Vame.io</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        await Freelancer.findOneAndUpdate(
          { _id: freelancerProjectStatus.projectStatus.assignedFreelancer },
          {
            $push: {
              notifications: {
                notificationType: "Project Completed",
                notificationMessage:
                  "Employer has completed the Project. You can now be able to release your payment",
                timeDate: new Date(),
                seen: false,
              },
            },
          }
        );
        res.json({
          success: "Project Completed Successfully...",
        });
      }
    } else {
      res.json({ error: "Project is not Completed by Freelancer" });
    }
  } catch (err) {
    res.status(400).json({ error: "Read Category failed." });
  }
};

exports.savedFreelancer = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, freelancerId } = req.body;
    const saveJobs = await EmployerDetails.findOneAndUpdate(
      { email },
      {
        $push: {
          "savedJobs.jobs": freelancerId,
        },
      }
    ).lean();

    if (saveJobs) {
      await res.json({ success: "Freelancer saved Successfully..." });
    }
  } catch (err) {
    res.status(400).json({ error: "Save Freelancer Failed..." });
  }
};

exports.readSavedFreelancer = async (req, res) => {
  try {
    // console.log(req.body);
    const { email } = req.body;
    const readSavedJobs = await EmployerDetails.findOne({
      email,
    })
      .populate("savedJobs.jobs")
      .lean();
    // console.log(readSavedJobs);
    const savedJobs = await readSavedJobs.savedJobs;

    res.json({ savedJobs });
  } catch (err) {
    res.status(400).json({ error: "Read Saved Jobs Failed..." });
  }
};

exports.removeSaveFreelancer = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, freelancerId } = req.body;

    const removedSavedJob = await EmployerDetails.findOneAndUpdate(
      { email },
      { $pull: { "savedJobs.jobs": freelancerId } }
    );

    if (removedSavedJob !== null) {
      res.json({ success: "Successfully remove from saved items." });
    }
  } catch (err) {
    res.status(400).json({ error: "Remove Freelancer Failed..." });
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

exports.deleteEmployerUserAccount = async (req, res) => {
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

    const verifyEmail1 = await EmployerDetails.findOne({ email }).lean();

    if (pass && verifyEmail1) {
      const deleteEmployer = await EmployerDetails.findOneAndDelete({
        email,
      }).lean();
      const hardDelete = await User.findOneAndDelete({ email }).lean();

      if (deleteEmployer && hardDelete) {
        try {
          const savedDeletedUserDetails = await EmployerDeleteDetails.create({
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

exports.readDeletedEmployerUserAccount = async (req, res) => {
  try {
    const deleteEmployerDetails = await EmployerDeletedAccounts.find({}).lean();

    res.json({ deleteEmployerDetails });
  } catch (err) {
    res.status(400).json({ error: "Read Delete Employer Users Failed..." });
  }
};

exports.employerCourseEnrollment = async (req, res) => {
  try {
    // console.log(req.body);
    const { employerId, email, courseId } = req.body;

    const courseEnrollment = await EmployerDetails.findOneAndUpdate(
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
            employersEnrolled: {
              employerId: employerId,
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

exports.employerMarkCompletedContentStatus = async (req, res) => {
  try {
    const { courseContentId, contentStatus, courseId, email } = req.body;

    const updateContent = await EmployerDetails.findOneAndUpdate(
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

    const updateQuizContent = await EmployerDetails.findOneAndUpdate(
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

      const updateQuizContent = await EmployerDetails.findOneAndUpdate(
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

exports.employerSubmitQuiz = async (req, res) => {
  try {
    const { email, courseId, quizId } = req.body;

    const findQuiz = await EmployerDetails.findOne({
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

    const submitQuiz = await EmployerDetails.findOneAndUpdate(
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
      let employerCoursePassed = await EmployerDetails.findOne({
        email: email,
        coursesEnrolled: { $elemMatch: { courseId: courseId } },
      }).lean();

      let coursePassed = parseInt(
        employerCoursePassed.coursesEnrolled.map(
          (i) => (i.quiz.quizMarks * 100) / i.quiz.quizContent.length
        )
      );

      if (coursePassed > 35) {
        await EmployerDetails.findOneAndUpdate(
          {
            email: email,
            coursesEnrolled: { $elemMatch: { courseId: courseId } },
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
    console.log(req.body);
    const { quizId, courseId, email } = req.body;

    const resetQuiz = await EmployerDetails.findOneAndUpdate(
      {
        email,
        coursesEnrolled: { $elemMatch: { courseId: courseId } },
      },
      {
        "coursesEnrolled.$.quiz.quizId": quizId,
        $set: {
          "coursesEnrolled.$.quiz.quizContent": [],
          "coursesEnrolled.$.quiz.quizMarks": 0,
          "coursesEnrolled.$.quiz.quizStatus": false,
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

exports.projectPaymentWithCard = async (req, res) => {
  try {
    const {
      cardDetails,
      shopperDetails,
      amount,
      firstName,
      lastName,
      email,
      jobId,
    } = req.body;

    const checkEmployer = await EmployerDetails.findOne({
      email: email,
    }).lean();
    if (!cardDetails.cardNumber) {
      res.json({ error: "Please enter a Card Number" });
    } else if (cardDetails.cardNumber.length > 16) {
      res.json({
        error: "Card Number Should not be more than 16 Digits",
      });
    } else if (!cardDetails.cardHolder) {
      res.json({ error: "Please enter Card Holder Name" });
    } else if (!cardDetails.expirationMonth) {
      res.json({ error: "Please enter Validity Month" });
    } else if (cardDetails.expirationMonth.length > 2) {
      res.json({ error: "Validity Month Should not more than 2 Digits" });
    } else if (!cardDetails.expirationYear) {
      res.json({ error: "Please select Validity Year" });
    } else if (cardDetails.expirationYear.length < 4) {
      res.json({ error: "Validity Year should be of 4 Digits only." });
    } else if (cardDetails.expirationYear.length > 4) {
      res.json({
        error: "Validity Year should not more than 4 Digits only.",
      });
    } else if (!cardDetails.securityCode) {
      res.json({ error: "Please enter a CVV" });
    } else if (cardDetails.securityCode.length < 3) {
      res.json({ error: "CVV Code should of 3 Digits only." });
    } else if (cardDetails.securityCode.length > 3) {
      res.json({
        error: "Validity Year should not more than 3 Digits only.",
      });
    } else if (!shopperDetails.fullName) {
      res.json({ error: "Please enter a FullName" });
    } else if (!shopperDetails.email) {
      res.json({ error: "Please enter a Email" });
    } else if (!shopperDetails.zip) {
      res.json({ error: "Please enter a Zip or Postal Code" });
    } else {
      await axios
        .post(
          "https://sandbox.bluesnap.com/services/2/transactions",
          {
            amount: amount,
            softDescriptor: shopperDetails.fullName,
            cardHolderInfo: {
              firstName: firstName,
              lastName: lastName,
              zip: shopperDetails.zip,
            },
            currency: "USD",
            creditCard: {
              expirationYear: cardDetails.expirationYear,
              securityCode: cardDetails.securityCode,
              expirationMonth: cardDetails.expirationMonth,
              cardNumber: cardDetails.cardNumber,
            },
            cardTransactionType: "AUTH_ONLY",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization:
                "Basic QVBJXzE2NDExOTIwMzE2NTAxMTU3OTg0OTY0OkEjckAyNTA0NjkxMyNhcg==",
            },
          }
        )
        .then(async (result) => {
          if (result) {
            const r = result.data;
            let orderId = orderid.getTime(id);
            let date_ob = new Date();

            const updateEmployerTransactionDetails =
              await EmployerDetails.findOneAndUpdate(
                {
                  email,
                },
                {
                  $push: {
                    projectPaymentDetails: {
                      jobId: jobId,
                      orderId: orderId,
                      transactionDetails: r,
                      orderDate: date_ob,
                    },
                    notifications: {
                      notificationType: "Project Payment",
                      notificationMessage:
                        "You have successfully paid the project amount.",
                      timeDate: new Date(),
                      seen: false,
                    },
                  },
                }
              );

            const updateTransactionDetails = await JobPost.findOneAndUpdate(
              {
                _id: jobId,
              },

              {
                $set: {
                  "projectStatus.paymentDetails": {
                    employerId: checkEmployer._id.toString(),
                    orderId: orderId,
                    transactionDetails: r,
                    orderDate: date_ob,
                  },
                  "projectStatus.employerStatus": "In Progress",
                  "projectStatus.proStatus": "In Progress",
                },
              }
            );

            let mailOptions = {
              from: "suryarathod315@gmail.com",
              to: email,
              subject: "Project Payment Successful.",
              html:
                "<h4>You have successsfully paid the full amount of your project.</h4>" +
                "<p>Thanks for using Vame.io</p>",
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });

            res.json({
              success: "Payment Successful...",
              transactionData: r,
              orderId,
            });
          }
        });
    }
  } catch {
    res.status(400).json({ error: "Project Payment has been failed..." });
  }
};

exports.projectPaymentWithPaypal = async (req, res) => {
  try {
    const { fullName, email, zip, amount, jobId } = req.body;

    if (!fullName) {
      res.json({ error: "Please enter a FullName" });
    } else if (!email) {
      res.json({ error: "Please enter a Email" });
    } else if (!zip) {
      res.json({ error: "Please enter a Zip or Postal Code" });
    } else {
      const checkJob = await JobPost.findOne({
        _id: jobId,
      }).lean();

      if (checkJob) {
        await axios
          .post(
            "https://sandbox.bluesnap.com/services/2/alt-transactions",
            {
              amount: amount,
              softDescriptor: fullName,
              currency: "USD",
              paypalTransaction: {
                cancelUrl: `${process.env.FRONT_URL}/employer/managejobs`,
                returnUrl: `${process.env.FRONT_URL}/employer/project/payment/${jobId}`,
                transactionType: "SET_ORDER",
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization:
                  "Basic QVBJXzE2NDExOTIwMzE2NTAxMTU3OTg0OTY0OkEjckAyNTA0NjkxMyNhcg==",
              },
            }
          )
          .then(async (result) => {
            if (result) {
              const r = result.data;
              res.json({
                success: "Redirecting to Paypal",
                r,
              });
            }
          });
      }
    }
  } catch {
    res.status(400).json({ error: "Project Payment with Paypal failed.." });
  }
};

exports.storeEmployerProjectPaymentPaypal = async (req, res) => {
  try {
    const { jobId, email, transactionId, accountId } = req.body;

    if (transactionId !== null) {
      const checkJob = await JobPost.findOne({
        _id: jobId,
      }).lean();

      const checkEmployer = await EmployerDetails.findOne({
        email: email,
      }).lean();

      if (!checkJob.projectStatus.paymentDetails) {
        let orderId = orderid.getTime(id);
        let date_ob = new Date();
        let r = {
          transactionId: transactionId,
          accountId: accountId,
          cardHolderInfo: {
            firstName: checkEmployer.firstname,
            lastName: checkEmployer.lastname,
          },
        };
        await EmployerDetails.findOneAndUpdate(
          {
            email,
          },
          {
            $push: {
              projectPaymentDetails: {
                jobId: jobId,
                orderId: orderId,
                transactionDetails: r,
                orderDate: date_ob,
              },
            },
          }
        );

        await JobPost.findOneAndUpdate(
          { _id: jobId },
          {
            $set: {
              "projectStatus.paymentDetails": {
                employerId: checkEmployer._id,
                orderId: orderId,
                transactionDetails: r,
                orderDate: date_ob,
              },
              "projectStatus.employerStatus": "In Progress",
              "projectStatus.proStatus": "In Progress",
            },
          }
        );
      }
      res.json({
        success: "Project Payment has been successfully completed",
      });
    }
  } catch {
    res.status(400).json({ error: "Store Details failed." });
  }
};

exports.rateFreelancer = async (req, res) => {
  try {
    const { ratingValue, description, employerId, freelancerId, jobId } =
      req.body;
    let date_ob = new Date();

    const addRatings = await Freelancer.findOneAndUpdate(
      { _id: freelancerId },
      {
        $push: {
          ratings: {
            jobId: jobId,
            ratings: ratingValue,
            description: description,
            employerId: employerId,
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
            "ratings.employerRatingsToFreelancer.ratings": ratingValue,
            "ratings.employerRatingsToFreelancer.employerId": employerId,
            "ratings.employerRatingsToFreelancer.reviews": description,
          },
        }
      );
      let mailOptions = {
        from: "suryarathod315@gmail.com",
        to: addRatings.email,
        subject: "Vame.io Ratings",
        html:
          "<h4>Congratulations you received ratings from Employer.</h4>" +
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

exports.inviteFreelancer = async (req, res) => {
  try {
    const { jobId, employerId, freelancerId, fixedPrice, noOfHours, seen } =
      req.body;

    if (!jobId) {
      return res.json({ error: "Please Select Job or Project. " });
    } else if (!fixedPrice && !noOfHours) {
      return res.json({
        error: "Please provide No of Hours or Fixed Price.",
      });
    } else {
      const verifyJobInvitation = await Freelancer.findOne({
        _id: freelancerId,
        invitations: {
          $elemMatch: { jobId: jobId },
        },
      });

      if (verifyJobInvitation) {
        const sendInvitation = await Freelancer.findOneAndUpdate(
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
              "invitations.$.seen": seen,
              "invitations.$.fixedPrice": fixedPrice,
              "invitations.$.noOfHours": noOfHours,
            },
            $push: {
              notifications: {
                notificationType: "Job Invitation",
                notificationMessage: "You have a new Job invitation.",
                timeDate: new Date(),
                seen: false,
              },
            },
          }
        );

        let mailOptions = {
          from: "suryarathod315@gmail.com",
          to: verifyJobInvitation.email,
          subject: "Job Invitation.",
          html:
            "<h4> You have a Job invitation from an employer from vame.io</h4>" +
            "<p>Thanks for using Vame.io</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        if (sendInvitation) {
          await JobPost.findOneAndUpdate(
            { _id: jobId },
            {
              sendInvitation: {
                freelancerId: freelancerId,
              },
            }
          );

          res.json({
            success: "Invitation send Successfully...",
          });
        }
      } else {
        const sendInvitation = await Freelancer.findOneAndUpdate(
          { _id: freelancerId },
          {
            $push: {
              invitations: {
                jobId: jobId,
                employerId: employerId,
                fixedPrice: fixedPrice,
                noOfHours: noOfHours,
                seen: seen,
              },
              notifications: {
                notificationType: "Job Invitation",
                notificationMessage: "You have a new Job invitation.",
                timeDate: new Date(),
                seen: false,
              },
            },
          }
        );
        const freelancerEmail = await Freelancer.findOne({
          _id: freelancerId,
        }).lean();

        let mailOptions = {
          from: "suryarathod315@gmail.com",
          to: freelancerEmail.email,
          subject: "Job Invitation.",
          html:
            "<h4> You have a Job invitation from an employer from vame.io</h4>" +
            "<p>Thanks for using Vame.io</p>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        if (sendInvitation) {
          await JobPost.findOneAndUpdate(
            { _id: jobId },
            {
              sendInvitation: {
                freelancerId: freelancerId,
              },
            }
          );
          res.json({ success: "Invitation send Successfully..." });
        }
      }
    }
  } catch {
    res.status(400).json({ error: "Invite freelancer Failed..." });
  }
};

exports.getbadges = async (req, res) => {
  try {
    const { email } = req.body;
    const employerDetails = await EmployerDetails.findOne({
      email: email,
    })
      .populate("ratings.jobId")
      .populate("purchaseCourses.courseId")
      .populate("ratings.freelancerId")
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

    res.json({ employerDetails });
  } catch (err) {
    res.status(400).json({ error: "Employer Badge Details failed." });
  }
};

exports.employerJob = async (req, res) => {
  try {
    const { email } = req.body;

    JobPost.find({ email }).exec((err, data) => {
      if (err) {
        console.log(err);
      }

      const pendingPayments = data
        .map((i, index, elements) => {
          if (
            !i.projectStatus.paymentDetails.employerId &&
            i.sendInvitation.freelancerAcceptStatus === true
          ) {
            return elements[index];
          }
        })
        .filter((n) => n);

      const currentJobs = data
        .map((i, index, elements) => {
          if (
            i.projectStatus.proStatus.toString() === "In Progress" ||
            i.projectStatus.employerStatus.toString() === "In Progress" ||
            i.projectStatus.proStatus.toString() === "Hold"
          ) {
            return elements[index];
          }
        })
        .filter((n) => n);

      const completedJobs = data
        .map((i, index, elements) => {
          if (i.projectStatus.proStatus.toString() === "Completed") {
            return elements[index];
          }
        })
        .filter((n) => n);

      const cancelledJobs = data
        .map((i, index, elements) => {
          if (i.projectStatus.proStatus.toString() === "Cancelled") {
            return elements[index];
          }
        })
        .filter((n) => n);

      res.json({
        pendingPayments,
        currentJobs,
        completedJobs,
        cancelledJobs,
      });
    });
  } catch {
    res.status(400).json({ error: "Something went Wrong !!!" });
  }
};

exports.employerNotifications = async (req, res) => {
  try {
    const { email } = req.body;

    EmployerDetails.findOne({
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

exports.notifications = async (req, res) => {
  try {
    const { email } = req.body;

    const employerDetails = await EmployerDetails.findOne({
      email,
    });

    const length = (await employerDetails)
      ? employerDetails.notifications
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
          await EmployerDetails.findOneAndUpdate(
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

exports.allNotifications = async (req, res) => {
  try {
    const { curr, email } = req.body;

    await EmployerDetails.findOne({ email })
      .select("notifications")
      .exec((err, data) => {
        if (err) return console.log(err);
        try {
          const page = curr;
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

          notifications.notifications = data.notifications.slice(
            startIndex,
            endIndex
          );

          res.json((paginatedResults = notifications));
        } catch (error) {
          console.log(error);
        }
      });
  } catch {
    res.status(400).json({ error: "Something went Wrong" });
  }
};
