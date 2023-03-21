const CourseCategory = require("../models/CourseCategory");
const slugify = require("slugify");

const { iconsList } = require("material-icons-list");

exports.addCourseCategory = async (req, res) => {
    try {
        let file = req.file;
        let path = "";
        if (file) {
            path = file.path;
        }
        const { categoryName, categoryTagline, description } = req.body;

        if (!categoryName)
            return res.json({ error: "Please Enter Course Category Name" });

        const verifyCategoryName = await CourseCategory.find({
            categoryName,
        }).lean();
        let slug = "";
        if (verifyCategoryName) {
            slug = slugify(
                categoryName + "-" + verifyCategoryName.length
            ).toLowerCase();
        }

        const courseCategoryDetails = await CourseCategory.create({
            categoryName: categoryName,
            categoryTagline: categoryTagline,
            description: description,
            categoryBadge: path,
            slug: slug === "" ? slugify(categoryName).toLowerCase() : slug,
        });

        await courseCategoryDetails.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Category Added Successfully",
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "Create Courses Category failed." });
    }
};

exports.listCoursesCategories = async (req, res) => {
    try {
        const listCoursesCategories = await CourseCategory.find({}).lean();

        res.json({ listCoursesCategories });
    } catch (err) {
        res.status(400).json({ error: "Read Courses failed." });
    }
};

exports.singleCoursesCategories = async (req, res) => {
    try {
        const readCourseCategories = await CourseCategory.findOne({
            slug: req.params.slug,
        }).lean();

        res.json({ readCourseCategories });
    } catch (err) {
        res.status(400).json({ error: "Read Single Course Failed.." });
    }
};

exports.editCourseCategories = async (req, res) => {
    try {
        let file = req.file;
        let path = "";
        if (file) {
            path = file.path;
        }

        const { categoryName, categoryTagline, description } = req.body;

        const verifyCategoryName = await CourseCategory.find({
            categoryName: categoryName,
        }).lean();
        let slug = "";
        if (verifyCategoryName) {
            slug = slugify(
                categoryName + "-" + verifyCategoryName.length
            ).toLowerCase();
        }

        const updateCourseCategoryDetails =
            await CourseCategory.findOneAndUpdate(
                { slug: req.params.slug },
                {
                    categoryName: categoryName,
                    categoryTagline: categoryTagline,
                    description: description,
                    categoryBadge: req.body.categoryBadge
                        ? req.body.categoryBadge
                        : path,
                    slug:
                        slug === ""
                            ? slugify(categoryName).toLowerCase()
                            : slug,
                }
            ).lean();

        if (updateCourseCategoryDetails) {
            res.json({ success: "Category details updated Successfully." });
        } else {
            res.json({ error: "Category details updation Failed." });
        }
    } catch (err) {
        res.status(400).json({ error: "Edit Courses Category Failed.." });
    }
};

exports.deleteCourseCategories = async (req, res) => {
    try {
        const deleteCourseCategory = await CourseCategory.findByIdAndDelete({
            _id: req.params.id,
        }).lean();

        if (deleteCourseCategory) {
            res.json({
                success: `${deleteCourseCategory.categoryName} successfully deleted`,
            });
        } else {
            res.json({
                error: `${deleteCourseCategory.categoryName} deletion failed...`,
            });
        }
    } catch (err) {
        res.status(400).json({ error: "Delete Course Failed..." });
    }
};

exports.getIcons = async (req, res) => {
    try {
        res.json({ iconsList });
    } catch {
        res.status(400).json({ error: "Read Icons Details failed." });
    }
};
