const Groups = require("../models/groups");
const GroupsCategory = require("../models/groupCategory");
const GroupTags = require("../models/groupsTags");
const slugify = require("slugify");

exports.addNewGroup = async (req, res) => {
  try {
    const { groupTitle, description, autherId, groupMembers, groupCourse } = req.body;
    console.log(req.body);

    if (!groupTitle)
      return res.json({
        error: "Please Enter Group Name...",
      });

    const checkGroup = await Groups.findOne({ name:groupTitle }).lean();
    if (checkGroup) return res.json({ error: "Group name is already added.." });

    const addGroupCategory = await Groups.create({
      name: groupTitle,
      description: description,
      autherId: autherId,
      groupMembers: groupMembers,
      groupCourse: groupCourse,
      slug: slugify(groupTitle).toLowerCase(),
    });

    await addGroupCategory.save((error) => {
      if (error) {
        res.json({ error });
      } else {
        res.json({
          addGroupCategory,
          success: "Group has added Successfully !!!",
        });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Create Group Failed !!!" });
  }
};

exports.listNewGroups = async (req, res) => {
  try {
    const allGroupData = await Groups.find({}).populate("autherId").lean();

    res.json({ allGroupData });
  } catch (error) {
    res.status(400).json({ error: "Groups details Failed !!!" });
  }
};

exports.addGroupsCategories = async (req, res) => {
  try {
    const { name, slug, description, paerntGroupCategory } = req.body;

    if (!name)
      return res.json({
        error: "Please Enter Group Category Name...",
      });
    if (!slug)
      return res.json({
        error: "Please Enter Slug...",
      });

    const checkGroup = await GroupsCategory.findOne({ name }).lean();
    if (checkGroup)
      return res.json({ error: "Group Category name is already added.." });

    const checkGroupSlug = await GroupsCategory.findOne({ slug }).lean();
    if (checkGroupSlug)
      return res.json({ error: "Group slug is already added.." });

    const addGroupCategory = await GroupsCategory.create({
      name: name,
      slug: slug,
      perentgroups: paerntGroupCategory,
      description: description,
    });

    await addGroupCategory.save((error) => {
      if (error) {
        res.json({ error });
      } else {
        res.json({
          success: "Group Category has added Successfully !!!",
        });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Create Group Category Failed !!!" });
  }
};

exports.allGroupsCategory = async (req, res) => {
  try {
    const allGroupData = await GroupsCategory.find({}).lean();

    res.json({ allGroupData });
  } catch (error) {
    res.status(400).json({ error: "Groups Category details Failed !!!" });
  }
};

exports.addGroupsTags = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name)
      return res.json({
        error: "Please Enter Group Tags Name...",
      });
    if (!slug)
      return res.json({
        error: "Please Enter Slug...",
      });

    const checkGroup = await GroupTags.findOne({ name }).lean();
    if (checkGroup) return res.json({ error: "Group Tags is already added.." });

    const checkGroupSlug = await GroupTags.findOne({ slug }).lean();
    if (checkGroupSlug)
      return res.json({ error: "Group slug is already added.." });

    const addGroupTags = await GroupTags.create({
      name: name,
      slug: slug,
      description: description,
    });

    await addGroupTags.save((error) => {
      if (error) {
        res.json({ error });
      } else {
        res.json({
          success: "Group Tags has added Successfully !!!",
        });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Create Group Tags Failed !!!" });
  }
};

exports.allGroupsTags = async (req, res) => {
  try {
    const allGroupTags = await GroupTags.find({}).lean();

    res.json({ allGroupTags });
  } catch (error) {
    res.status(400).json({ error: "Group Tags details Failed !!!" });
  }
};
