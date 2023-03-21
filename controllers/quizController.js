const Quizzes = require("../models/Quizzes");
const slugify = require("slugify");

exports.createQuiz = async (req, res) => {
    try {
        const { courseId, quizName, quizContent, authorId } = req.body;

        if (!quizName)
            return res.json({
                error: "Please Enter Quiz Name...",
            });
        if (!courseId)
            return res.json({
                error: "Please Select your Course...",
            });
        if (quizContent.length < 10)
            return res.json({
                error: "Please Provide at least 10 Questions...",
            });

        const checkCourseQuiz = await Quizzes.findOne({ courseId }).lean();

        if (checkCourseQuiz)
            return res.json({ error: "Quiz is already Added for this course" });

        const checkQuizName = await Quizzes.findOne({ quizName }).lean();

        if (checkQuizName)
            return res.json({ error: "Please input a different Quiz Name" });

        const addQuiz = await Quizzes.create({
            authorId: authorId,
            courseId: courseId,
            quizName: quizName,
            quizContent: quizContent,
            slug: slugify(quizName).toLowerCase(),
        });

        await addQuiz.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Quiz has added Successfully !!!",
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "Create Quiz Failed !!!" });
    }
};

exports.editQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { courseId, quizName, quizContent, authorId } = req.body;

        if (!quizName)
            return res.json({
                error: "Please Enter Quiz Name...",
            });
        if (!courseId)
            return res.json({
                error: "Please Select your Course...",
            });
        if (quizContent.length < 10)
            return res.json({
                error: "Please Provide at least 10 Questions...",
            });

        const editQuiz = await Quizzes.findOneAndUpdate(
            {
                _id: quizId,
            },
            {
                authorId: authorId,
                courseId: courseId,
                quizName: quizName,
                quizContent: quizContent,

                slug: slugify(quizName).toLowerCase(),
            }
        ).lean();

        if (editQuiz) {
            res.json({ success: "Quiz has been edited Successfully !!!" });
        } else {
            res.json({ error: "Something went Wrong..." });
        }
    } catch {
        res.status(400).json({ error: "Edit Quiz Failed..." });
    }
};

exports.readQuizzes = async (req, res) => {
    try {
        const quizDetails = await Quizzes.find({})
            .populate("authorId")
            .populate("courseId")
            .lean();
        res.json({ quizDetails });
    } catch {
        res.status(400).json({ error: "Read Quiz details Failed !!!" });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        const deleteQuiz = await Quizzes.findOneAndDelete({
            _id: quizId,
        }).lean();

        if (deleteQuiz) {
            res.json({ success: "Quiz has been deleted Successfully !!!" });
        } else {
            res.json({ error: "Something went Wrong" });
        }
    } catch {
        res.status(400).json({ error: "Delete Quiz Failed..." });
    }
};

exports.readSingleQuiz = async (req, res) => {
    try {
        const { qslug } = req.params;

        const quizDetails = await Quizzes.findOne({ slug: qslug })
            .populate("courseId")
            .populate("courseId.courseCategory")
            .lean();

        res.json({ quizDetails });
    } catch {
        res.status(400).json({ error: "Read Single Quiz Failed..." });
    }
};
