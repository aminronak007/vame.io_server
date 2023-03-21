const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/jwtToken");

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  getUsers,
  updatePassword,
} = require("../controllers//authController");

router.get("/", verifyAccessToken);
router.post("/api/signup", signUp);
router.post("/api/login", login);
router.post("/api/forgotpassword", forgotPassword);
router.post("/api/resetpassword/:id", resetPassword);
router.post("/api/users", getUsers);
router.put("/api/update/password/:id", updatePassword);

module.exports = router;
