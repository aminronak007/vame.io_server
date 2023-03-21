const express = require("express");
const router = express.Router();
const {
  createQuiz,
  editQuiz,
  readQuizzes,
  readSingleQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

router.post("/api/add/quiz", createQuiz);
router.put("/api/edit/quiz/:quizId", editQuiz);
router.get("/api/read/quiz/details", readQuizzes);
router.get("/api/read/quiz/details/:qslug", readSingleQuiz);
router.delete("/api/delete/quiz/:quizId", deleteQuiz);

module.exports = router;
