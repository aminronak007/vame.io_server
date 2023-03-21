const Courses = require("../models/Courses");
const slugify = require("slugify");
const fs = require("fs");

exports.addCourses = async (req, res) => {
  try {
    const files = req.files;
    let courseImage = "";
    let url = [];

    if (files.courseImage) {
      courseImage = files.courseImage.map((i) => i.path).toString();
    }

    if (files.url) {
      for (i = 0; i < files.url.length; i++) {
        url.push(files.url[i].path.toString());
      }
    }
    try {
      const {
        parentCategory,
        courseName,
        feature,
        price,
        description,
        contentData,
      } = req.body;

      const cData = JSON.parse(contentData);
      console.log("contentData", cData);
      const verifyCourseName = await Courses.findOne({
        courseTitle: courseName,
      }).lean();

      let slug = "";

      if (verifyCourseName) {
        slug = slugify(
          courseName + "-" + verifyCourseName.length
        ).toLowerCase();
      }

      let cc = [];
      let p = parseInt(price);

      for (let i = 0; i < cData.length; i++) {
        cc.push({
          contentTopic: cData[i].contentTopic,
          slug: slugify(cData[i].contentTopic).toLowerCase(),
          url: url[i],
          description: cData[i].description,
        });
      }

      const addCourse = await Courses.create({
        courseCategory: parentCategory,
        courseTitle: courseName,
        feature: feature,
        price: p,
        courseDescription: description,
        courseImageUrl: courseImage,
        courseContent: cc,
        slug: slug === "" ? slugify(courseName).toLowerCase() : slug,
      });

      await addCourse.save((error) => {
        if (error) {
          res.json({ error });
        } else {
          res.json({ success: "Course Added Successfully" });
        }
      });
    } catch {}
  } catch (err) {
    res.status(400).json({ error: "Add Courses Failed..." });
  }
};

exports.listCourses = async (req, res) => {
  try {
    const listCoursesDetails = await Courses.find({})
      .populate("courseCategory")
      .lean();

    if (listCoursesDetails) {
      res.json({ listCoursesDetails });
    } else {
      res.json({ error: "List Courses Details Failed." });
    }
  } catch (err) {
    res.status(400).json({ error: "List Courses Failed..." });
  }
};
exports.readSingleCourse = async (req, res) => {
  try {
    // console.log(req.params);
    const readSingleCourseDetails = await Courses.findOne({
      slug: req.params.slug,
    })
      .populate("courseCategory")
      .populate("freelancersEnrolled.freelancerId")
      .populate("employersEnrolled.employerId")
      .lean();

    if (readSingleCourseDetails) {
      res.json({ readSingleCourseDetails });
    }
  } catch (err) {
    res.status(400).json({ error: "Read Single Course Details Failed..." });
  }
};

exports.readSingleCourseById = async (req, res) => {
  try {
    // console.log(req.params);
    const readSingleCourseDetails = await Courses.findOne({
      _id: req.params.id,
    })
      .populate("courseCategory")
      .populate("freelancersEnrolled.freelancerId")
      .populate("employersEnrolled.employerId")
      .lean();

    if (readSingleCourseDetails) {
      res.json({ readSingleCourseDetails });
    }
  } catch (err) {
    res.status(400).json({ error: "Read Single Course Details Failed..." });
  }
};

exports.editCourses = async (req, res) => {
  try {
    // console.log(req.body);
    const files = req.files;
    let courseImage = "";
    let url = [];

    if (files.courseImage) {
      courseImage = files.courseImage.map((i) => i.path).toString();
    }
    if (files.url) {
      for (i = 0; i < files.url.length; i++) {
        url.push(files.url[i].path.toString());
      }
    }

    try {
      const {
        parentCategory,
        courseName,
        feature,
        price,
        description,
        contentData,
      } = req.body;

      const cData = JSON.parse(contentData);

      const verifyCourseName = await Courses.find({
        courseTitle: courseName,
      }).lean();
      let slug = "";
      if (verifyCourseName) {
        slug = slugify(
          courseName + "-" + verifyCourseName.length
        ).toLowerCase();
      }

      let cc = [];
      let p = parseInt(price);

      for (let i = 0; i < cData.length; i++) {
        cc.push({
          contentTopic: cData[i].contentTopic,
          slug: slugify(cData[i].contentTopic).toLowerCase(),
          url: url[i],
          description: cData[i].description,
        });
      }

      const addCourse = await Courses.findOneAndUpdate(
        { slug: req.params.slug },
        {
          courseCategory: parentCategory,
          courseTitle: courseName,
          feature: feature,
          price: p,
          courseDescription: description,
          courseImageUrl: req.body.courseImage
            ? req.body.courseImage
            : courseImage,
          $push: {
            courseContent: cc,
          },
          slug: slug === "" ? slugify(courseName).toLowerCase() : slug,
        }
      );

      if (addCourse) {
        res.json({
          success: "Course Details Updated Successfully",
        });
      } else {
        res.json({ error: "Course Updation Failed..." });
      }
    } catch {}
  } catch (err) {
    res.status(400).json({ error: "Update Course Details Failed..." });
  }
};

exports.deleteCourses = async (req, res) => {
  try {
    const deleteCourse = await Courses.findByIdAndDelete({
      _id: req.params.id,
    }).lean();

    if (deleteCourse) {
      res.json({
        success: `${deleteCourse.courseTitle} is deleted successfully.`,
      });
    } else {
      res.json({
        error: `${deleteCourse.courseTitle} deletion failed.`,
      });
    }
  } catch (err) {
    res.status(400).json({ error: "Deletion Failed..." });
  }
};

exports.removeSingleContent = async (req, res) => {
  try {
    // console.log(
    //     "cc",
    //     req.body.courseContentId,
    //     "id",
    //     req.params.id,
    //     req.body
    // );
    const { courseContentId, path } = req.body;

    const removeSingleContent = await Courses.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $pull: { courseContent: { _id: courseContentId } },
      }
    );
    if (removeSingleContent) {
      fs.unlinkSync(`./${path}`);
      res.json({ success: "Content removed successfully" });
    } else {
      res.json({ error: "Content Deletion Failed." });
    }
  } catch (err) {
    res.status(400).json({ error: "Remove Single Content Failed..." });
  }
};

exports.featureCourse = async (req, res) => {
  const featureCourses = await Courses.find({ feature: "yes" }).lean();

  res.json({ featureCourses });
};
