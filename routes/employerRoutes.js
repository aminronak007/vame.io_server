const router = require("express").Router();
const { upload } = require("../middlewares/multer");
const {
  readEmployerDetails,
  updateEmployerDetails,
  jobPost,
  userManageAccount,
  getEmployerDetails,
  updateBillingDetails,
  updateNotificationEmail,
  deleteAccount,
  acceptproject,
  listJobs,
  readSingleJobs,
  readJobById,
  readCategoryWiseData,
  assignProjects,
  cancelProjects,
  employerJobs,
  projectCompleted,
  savedFreelancer,
  readSavedFreelancer,
  removeSaveFreelancer,
  cancelNotificationEmail,
  deleteEmployerUserAccount,
  readDeletedEmployerUserAccount,
  employerCourseEnrollment,
  employerMarkCompletedContentStatus,
  startQuiz,
  quizApply,
  employerSubmitQuiz,
  resetQuiz,
  readEmployerEnrolledCourses,
  projectPaymentWithCard,
  projectPaymentWithPaypal,
  storeEmployerProjectPaymentPaypal,
  rateFreelancer,
  inviteFreelancer,
  readSingleEmployer,
  getbadges,
  employerJob,
  employerNotifications,
  notifications,
  allNotifications,
} = require("../controllers/employerController");

router.post("/api/job-post", upload.single("file"), jobPost);
router.post("/api/employer-details", readEmployerDetails);
router.post("/api/employer/enrolled/courses", readEmployerEnrolledCourses);
router.put(
  "/api/update/employer-details",
  upload.fields([
    {
      name: "employeepropic",
    },
    {
      name: "brochure",
    },
  ]),
  updateEmployerDetails
);
router.put("/api/employer-account-settings", userManageAccount);
router.post("/api/employer-detail", readSingleEmployer);
router.get("/api/employer-all-details", getEmployerDetails);
router.put("/api/update/employer/billing-details", updateBillingDetails);
router.put("/api/update/employer/notification-email", updateNotificationEmail);
router.get("/api/jobs/:id", readJobById);
router.delete("/api/delete/employer", deleteAccount);
router.post("/api/acceptproject/:slug", acceptproject);
router.post("/api/listjobs", listJobs);
router.get("/api/list-jobs/:slug", readSingleJobs);
router.post("/api/category/details", readCategoryWiseData);
router.post("/api/employer/jobs", employerJobs);
router.post("/api/assign-projects", assignProjects);

router.post("/api/employer/cancel-projects/:jobId", cancelProjects);
router.post("/api/employer/project-completed/:jobId", projectCompleted);

router.post("/api/employer/save/jobs", savedFreelancer);
router.post("/api/employer/read/save-jobs", readSavedFreelancer);
router.post("/api/employer/remove/save-jobs", removeSaveFreelancer);

router.post("/api/cancel/notification-email", cancelNotificationEmail);

router.post("/api/employer/delete/user/account", deleteEmployerUserAccount);
router.get(
  "/api/employer/read/user/deleted-account",
  readDeletedEmployerUserAccount
);

router.post("/api/employer/course/enrollment", employerCourseEnrollment);
router.post(
  "/api/employer/mark/content/status",
  employerMarkCompletedContentStatus
);
router.put("/api/employer/quiz/start", startQuiz);
router.put("/api/employer/quiz/apply", quizApply);
router.put("/api/employer/quiz/submit", employerSubmitQuiz);
router.put("/api/employer/quiz/reset", resetQuiz);
router.post("/api/employer/project/payment", projectPaymentWithCard);
router.post("/api/employer/project/paypal/payment", projectPaymentWithPaypal);
router.post(
  "/api/employer/project/store/paymentDetails",
  storeEmployerProjectPaymentPaypal
);

router.put("/api/employer/ratings", rateFreelancer);
router.put("/api/employer/invite", inviteFreelancer);

router.post("/api/employer/badges", getbadges);

router.post("/api/employer/job", employerJob);

router.post("/api/employer/notifications", employerNotifications);

router.post("/api/employer/seen/notifications", notifications);

router.post("/api/employer/all-notifications", allNotifications);

module.exports = router;
