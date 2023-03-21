const router = require("express").Router();
const { upload } = require("../middlewares/multer");
const {
  readFreelancerDetails,
  updateFreelancerDetails,
  userManageAccount,
  getFreelancerDetails,
  getFreelancerVideos,
  updateBillingDetails,
  updateNotificationEmail,
  deleteAccount,
  readSingleFreelancer,
  hourRateAndEnglishLevelFilter,
  acceptProject,
  cancelProject,
  projectCompleted,
  savedJobs,
  readSavedJobs,
  removeSavedJobs,
  cancelNotificationEmail,
  deleteFreelancerUserAccount,
  readDeletedFreelancerUserAccount,
  courseEnrollment,
  markCompletedContentStatus,
  startQuiz,
  quizApply,
  freelancerSubmitQuiz,
  resetQuiz,
  readFreelancerEnrolledCourses,
  addBankAccount,
  applyForPayment,
  rateEmployer,
  createChat,
  acceptInvitation,
  rejectInvitation,
  notifications,
  freelancerBadges,
  freelancerJobInvitations,
  freelancerJobs,
  freelancerNotifications,
  fNotifications,
} = require("../controllers/freelancerController");

router.put(
  "/api/update/freelancer-profile",
  upload.fields([
    {
      name: "propic",
    },
    {
      name: "bannerpic",
    },
    {
      name: "resume",
    },
    { name: "awards" },
  ]),
  updateFreelancerDetails
);
router.post("/api/freelancer-details", readFreelancerDetails);
router.post("/api/enrolled/courses", readFreelancerEnrolledCourses);
router.put("/api/freelancer-account-settings", userManageAccount);
router.post("/api/freelancer-details-delete");
router.post("/api/freelancer-detail", getFreelancerDetails);
router.get("/api/freelancer-videos", getFreelancerVideos);
router.put("/api/update/freelancer/billing-details", updateBillingDetails);
router.put(
  "/api/update/freelancer/notification-email",
  updateNotificationEmail
);
router.delete("/api/delete/freelancer", deleteAccount);
router.get("/api/freelancer-detail/:id", readSingleFreelancer);
router.post("/api/freelancer/filters", hourRateAndEnglishLevelFilter);

router.post("/api/freelancer/accept-project/:jobId", acceptProject);
router.post("/api/freelancer/cancel-project/:jobId", cancelProject);
router.post("/api/freelancer/project-completed/:jobId", projectCompleted);

router.post("/api/save/jobs", savedJobs);
router.post("/api/read/save-jobs", readSavedJobs);
router.post("/api/remove/save-jobs", removeSavedJobs);

router.post("/api/cancel/notification-email", cancelNotificationEmail);

router.post("/api/freelancer/delete/user/account", deleteFreelancerUserAccount);
router.get(
  "/api/freelancer/read/user/deleted-account",
  readDeletedFreelancerUserAccount
);
router.post("/api/freelancer/course/enrollment", courseEnrollment);
router.post("/api/freelancer/mark/content/status", markCompletedContentStatus);
router.put("/api/freelancer/quiz/start", startQuiz);
router.put("/api/freelancer/quiz/apply", quizApply);
router.put("/api/freelancer/quiz/submit", freelancerSubmitQuiz);
router.put("/api/freelancer/quiz/reset", resetQuiz);
router.put("/api/freelancer/add/bank/details", addBankAccount);
router.put("/api/freelancer/apply/payment", applyForPayment);
router.put("/api/freelancer/ratings", rateEmployer);
router.post("/api/freelancer/chat", createChat);
router.put("/api/freelancer/accept/invitation", acceptInvitation);
router.put("/api/freelancer/reject/invitation", rejectInvitation);
router.post("/api/freelancer/notifications", notifications);
router.get("/api/freelancer/badges/:id", freelancerBadges);

// Manage Projects Routes
router.post("/api/freelancer/invitations", freelancerJobInvitations);
router.post("/api/freelancer/jobs", freelancerJobs);

// Notifications
router.post("/api/freelancer/notifications1", freelancerNotifications);
router.post("/api/freelancer/all-notifications", fNotifications);

module.exports = router;
