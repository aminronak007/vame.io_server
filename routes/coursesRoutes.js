const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer");
const {
  addCourses,
  listCourses,
  readSingleCourse,
  readSingleCourseById,
  editCourses,
  deleteCourses,
  removeSingleContent,
  featureCourse,
} = require("../controllers/coursesController");

router.post(
  "/api/add/courses",
  upload.fields([
    {
      name: "courseImage",
    },
    {
      name: "url",
    },
  ]),
  addCourses
);

router.get("/api/list/courses", listCourses);
router.get("/api/read/course/:slug", readSingleCourse);
router.get("/api/payment/course/:id", readSingleCourseById);
router.put(
  "/api/edit/courses/:slug",
  upload.fields([
    {
      name: "courseImage",
    },
    {
      name: "url",
    },
  ]),
  editCourses
);
router.delete("/api/delete/course/:id", deleteCourses);
router.post("/api/delete/course/content/:id", removeSingleContent);
router.get("/api/feature/course", featureCourse);

module.exports = router;
