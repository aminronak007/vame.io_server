const router = require("express").Router();
const {
  getIcons,
  createCategory,
  readCategories,
  createFreelancerType,
  readFreelancerTypes,
  createLanguages,
  readLanguages,
  createLocation,
  readLocations,
  createProjectDuration,
  readProjectDuration,
  createProjectExperience,
  readProjectExperience,
  createProjectLevel,
  readProjectLevel,
  createSkills,
  readSkills,
  paidFreelancerStatus,
  listProjects,
} = require("../controllers/projectMasterController");

// -------------------------------------- Project Master Routes -----------------------------------------------------
router.post("/api/icons", getIcons);

router.get("/api/projectslist", listProjects);

router.post("/api/category", createCategory);
router.get("/api/categories", readCategories);

router.post("/api/freelancerType", createFreelancerType);
router.get("/api/freelancer", readFreelancerTypes);

router.post("/api/languages", createLanguages);
router.get("/api/language", readLanguages);

router.post("/api/location", createLocation);
router.get("/api/locations", readLocations);

router.post("/api/projectDuration", createProjectDuration);
router.get("/api/projectdurations", readProjectDuration);

router.post("/api/projectExperience", createProjectExperience);
router.get("/api/projectexperiences", readProjectExperience);

router.post("/api/projectleval", createProjectLevel);
router.get("/api/projectlevels", readProjectLevel);

router.post("/api/skills", createSkills);
router.get("/api/skill", readSkills);

router.post("/api/release/payment/status", paidFreelancerStatus);

// -------------------------------------- Project Master Routes -----------------------------------------------------

module.exports = router;
