const router = require("express").Router();
const User = require("../models/user");

router.get("/api/users", async (req, res) => {
  const userId = req.query.userId;
  if (userId) {
    const user = await User.findById({ _id: userId });
    res.status(200).json(user);
  }
});

router.get("/api/all-users", async (req, res) => {
  const user = await User.find();
  res.status(200).json(user);
});

router.post("/api/users-id", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).lean();
    const userId = await user._id;

    res.json(userId);
  } catch (err) {
    res.status(400).json({ error: "Get Users id failed..." });
  }
});

module.exports = router;
