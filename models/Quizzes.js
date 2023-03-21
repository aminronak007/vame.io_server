const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const quizSchema = mongoose.Schema({
  authorId: {
    type: ObjectId,
    ref: "Users",
  },
  courseId: {
    type: ObjectId,
    ref: "Courses",
  },
  quizName: {
    type: String,
  },
  quizContent: [
    {
      question: {
        type: String,
      },
      option1: {
        type: String,
      },
      option2: {
        type: String,
      },
      option3: {
        type: String,
      },
      option4: {
        type: String,
      },
      rightAnswer:{
        type: String,
      }
    },
  ],
  slug: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("Quizzes", quizSchema);
