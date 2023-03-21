const express = require("express");
const router = express.Router();
const {
  addCourseCategory,
  listCoursesCategories,
  singleCoursesCategories,
  getIcons,
  editCourseCategories,
  deleteCourseCategories,
} = require("../controllers/courseCategoryController");
const { upload } = require("../middlewares/multer");

router.post("/api/icons", getIcons);

router.post(
  "/api/add/course-category",
  upload.single("categoryBadge"),
  addCourseCategory
);
router.get("/api/list-courses", listCoursesCategories);
router.get("/api/read-course/:slug", singleCoursesCategories);
router.put(
  "/api/edit/category/:slug",
  upload.single("categoryBadge"),
  editCourseCategories
);
router.delete("/api/delete/category/:id", deleteCourseCategories);

module.exports = router;
