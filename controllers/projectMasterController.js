const Category = require("../models/categories");
const Freelancer = require("../models/freelancer");
const Language = require("../models/language");
const Location = require("../models/location");
const ProjectDuration = require("../models/projectDuration");
const ProjectExperience = require("../models/projectExperience");
const ProjectLevals = require("../models/projectLevals");
const Skill = require("../models/skills");
const { iconsList } = require("material-icons-list");
const JobPost = require("../models/jobpost");

exports.getIcons = async (req, res) => {
    try {
        res.json({ iconsList });
    } catch {
        res.status(400).json({ error: "Read Icons Details failed." });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, slug, perentCategory, description } = req.body;

        const newfileupload = await Category.create({
            name: name,
            slug: slug,
            perentCategory: perentCategory,
            description: description,
            categoryIcon: req.file,
        });

        await newfileupload.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Your Successfully Create New Category!!!",
                    newfileupload,
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "Create Category Details failed." });
    }
};

exports.readCategories = async (req, res) => {
    try {
        const categoryData = await Category.find();
        res.json({ categoryData });
    } catch (err) {
        res.status(400).json({ error: "Read Category Details failed." });
    }
};

exports.createFreelancerType = async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        const freelancer = await Freelancer.findOne({ name }).lean(); // Finding Email
        if (freelancer) return res.json({ error: "Name already exists !!!" }); // Checking Email Exits or Not

        const newFreelancer = await Freelancer.create({
            name: name,
            slug: slug,
            description: description,
        });

        await newFreelancer.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Your Successfully Create New Freelancer!!!",
                    newFreelancer,
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "Create Freelancer Type failed." });
    }
};

exports.readFreelancerTypes = async (req, res) => {
    try {
        const freelancerData = await Freelancer.find();
        res.json({ freelancerData });
    } catch (err) {
        res.status(400).json({
            error: "Read Freelancer Types Details failed.",
        });
    }
};

exports.createLanguages = async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        const language = await Language.findOne({ name }).lean(); // Finding Email
        if (language) return res.json({ error: "Name already exists !!!" }); // Checking Email Exits or Not

        const newLanguage = await Language.create({
            name: name,
            slug: slug,
            description: description,
        });

        await newLanguage.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Your Successfully Create New Language!!!",
                    newLanguage,
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "Create Languages Details failed." });
    }
};

exports.readLanguages = async (req, res) => {
    try {
        const languagesData = await Language.find();
        res.json({ languagesData });
    } catch (err) {
        res.status(400).json({ error: "Read Languages Details failed." });
    }
};

exports.createLocation = async (req, res) => {
    try {
        const { name, slug, perentlocation, description } = req.body;

        const location = await Location.findOne({ name }).lean(); // Finding Email
        if (location) return res.json({ error: "Name already exists !!!" }); // Checking Email Exits or Not

        const newLocation = await Location.create({
            name: name,
            slug: slug,
            perentlocation: perentlocation,
            description: description,
        });

        await newLocation.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Your Successfully Create New Location!!!",
                    newLocation,
                });
            }
        });
    } catch {
        res.status(400).json({ error: "Create Location Details failed." });
    }
};

exports.readLocations = async (req, res) => {
    try {
        const locationData = await Location.find();
        res.json({ locationData });
    } catch (err) {
        res.status(400).json({ error: "Read Location Details failed." });
    }
};

exports.createProjectDuration = async (req, res) => {
    try {
        const { name, slug, description, icon } = req.body;

        const projectduration = await ProjectDuration.findOne({ name }).lean(); // Finding Email
        if (projectduration)
            return res.json({ error: "Name already exists !!!" }); // Checking Email Exits or Not

        const newprojectDuration = await ProjectDuration.create({
            name: name,
            slug: slug,
            description: description,
            locationIcon: icon,
        });

        await newprojectDuration.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Your Successfully Create New ProjectDuration!!!",
                    newprojectDuration,
                });
            }
        });
    } catch (err) {
        res.status(400).json({
            error: "Create Project Duration Details failed.",
        });
    }
};

exports.readProjectDuration = async (req, res) => {
    try {
        const projectDurationData = await ProjectDuration.find();
        res.json({ projectDurationData });
    } catch (err) {
        res.status(400).json({
            error: "Read Project Duration Details failed.",
        });
    }
};

exports.createProjectExperience = async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        const projectExperience = await ProjectExperience.findOne({
            name,
        }).lean(); // Finding Email
        if (projectExperience)
            return res.json({ error: "Name already exists !!!" }); // Checking Email Exits or Not

        const newprojectExperience = await ProjectExperience.create({
            name: name,
            slug: slug,
            description: description,
        });

        await newprojectExperience.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success:
                        "Your Successfully Create New ProjectExperience!!!",
                    newprojectExperience,
                });
            }
        });
    } catch (err) {
        res.status(400).json({
            error: "Create Project Experience Details failed.",
        });
    }
};

exports.readProjectExperience = async (req, res) => {
    try {
        const projectExperienceData = await ProjectExperience.find();
        res.json({ projectExperienceData });
    } catch (err) {
        res.status(400).json({
            error: "Read Project Experience Details failed.",
        });
    }
};

exports.createProjectLevel = async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        const projectLevals = await ProjectLevals.findOne({ name }).lean(); // Finding Email
        if (projectLevals)
            return res.json({ error: "Name already exists !!!" }); // Checking Email Exits or Not

        const newprojectLevals = await ProjectLevals.create({
            name: name,
            slug: slug,
            description: description,
        });

        await newprojectLevals.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Your Successfully Create New ProjectLeval!!!",
                    newprojectLevals,
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "Create Project Level Details failed." });
    }
};

exports.readProjectLevel = async (req, res) => {
    try {
        const projectLevelsData = await ProjectLevals.find();
        res.json({ projectLevelsData });
    } catch (err) {
        res.status(400).json({ error: "Read Project Level Details failed." });
    }
};

exports.createSkills = async (req, res) => {
    try {
        const { name, slug, perentskill, description } = req.body;

        const skills = await Skill.findOne({ name }).lean(); // Finding Email
        if (skills) return res.json({ error: "Name already exists !!!" }); // Checking Email Exits or Not

        const newSkills = await Skill.create({
            name: name,
            slug: slug,
            perentskill: perentskill,
            description: description,
        });

        await newSkills.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({
                    success: "Your Successfully Create New Skills!!!",
                    newSkills,
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: "Create Skills Details failed." });
    }
};

exports.readSkills = async (req, res) => {
    try {
        const skillsData = await Skill.find();

        res.json({ skillsData });
    } catch (err) {
        res.status(400).json({ error: "Read Skills Details failed." });
    }
};

exports.paidFreelancerStatus = async (req, res) => {
    try {
        const { jobId } = req.body;

        const paidStatus = await JobPost.findOneAndUpdate(
            {
                _id: jobId,
            },
            {
                $set: {
                    "projectStatus.releasePaymentStatus": true,
                },
            }
        );
        if (paidStatus)
            return res.json({
                success: "Freelancer payment Status completed.",
            });
    } catch {
        res.status(400).json({ error: "Freelancer payment failed..." });
    }
};

exports.listProjects = async (req,res) => {
    try {
        // const { curr } = req.body;
        // let limit = 5;

        const jobDetails = await JobPost.find({})
            .populate("user")
            .populate("projectStatus.paymentDetails.employerId")
            // .limit(limit)
            // .skip(curr * limit)
            .lean();

        // const totalDocs = await JobPost.find({ assign: false }).lean();

        // let totalPages = Math.ceil(totalDocs.length / limit);

        res.json({ jobDetails });
    } catch (err) {
        res.status(400).json({ error: "List Jobs failed." });
    }
}