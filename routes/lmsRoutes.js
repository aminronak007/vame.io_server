const router = require("express").Router();
const { getIcons } = require("../controllers/projectMasterController");
const { iconsList } = require("material-icons-list");

router.post("/api/icons", getIcons);

module.exports = router;
