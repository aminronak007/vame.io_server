const multer = require("multer");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "file") {
            cb(null, "./public/jobpost");
        }
        if (file.fieldname === "propic") {
            cb(null, "./public/freelancer/profilePics");
        }
        if (file.fieldname === "bannerpic") {
            cb(null, "./public/freelancer/bannerPhotos");
        }
        if (file.fieldname === "resume") {
            cb(null, "./public/freelancer/resumes");
        }
        if (file.fieldname === "awards") {
            cb(null, "./public/freelancer/awards");
        }

        if (file.fieldname === "employeepropic") {
            cb(null, "./public/employer/employeepropic");
        }
        if (file.fieldname === "brochure") {
            cb(null, "./public/employer/brochure");
        }
        if (file.fieldname === "categoryBadge") {
            cb(null, "./public/category/badge");
        }

        if (file.fieldname === "courseImage") {
            cb(null, "./public/course");
        }

        if (file.fieldname === "url") {
            cb(null, "./public/videos");
        }
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname.split(" ").join("_"));
    },
});

exports.upload = multer({
    storage: multerStorage,
});
