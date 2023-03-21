const express = require("express");
const router = express.Router();

const {
  addNewGroup,
  listNewGroups,
  addGroupsCategories,
  allGroupsCategory,
  addGroupsTags,
  allGroupsTags,
} = require("../controllers/groupsController");

router.post("/api/add-new-group", addNewGroup);
router.get("/api/group/details", listNewGroups);

router.post("/api/groups/add-new-group-category", addGroupsCategories);
router.get("/api/groups/details", allGroupsCategory);

router.post("/api/groups/add-new-group-tags", addGroupsTags);
router.get("/api/groups/tags/details", allGroupsTags);

module.exports = router;
