const mongoose = require("mongoose");
const courseSchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
        },
        categoryTagline: {
            type: String,
        },
        description: {
            type: String,
        },
        categoryBadge: {
            type: String,
        },
        slug: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CourseCategories", courseSchema);
