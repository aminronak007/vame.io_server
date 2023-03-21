const express = require("express");
const EmployerDetails = require("../models/EmployerDetails");
const FreelancerDetails = require("../models/freelancerDetails");
const Jobpost = require("../models/jobpost");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/user");

router.post("/api/messages", async (req, res) => {
  setTimeout(function () {
    process.on("exit", function () {
      require("child_process").spawn(process.argv.shift(), process.argv, {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit",
      });
    });
    process.exit();
  }, 1000);
  const { sender, text, conversationId, id, noOfHours, fixedPrice, jobId } =
    req.body;

  const checkFreelancer = await FreelancerDetails.findOne({
    _id: id,
  }).lean();

  let freelancerId = checkFreelancer ? checkFreelancer._id : "";

  if (!jobId) {
    const newMessage = await new Message({
      sender: sender,
      text: text,
      conversationId: conversationId,
      freelancerId: freelancerId,
      noOfHours: noOfHours,
      fixedPrice: fixedPrice,
      jobId: jobId,
    });

    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  try {
    if (jobId) {
      const verifyJobOffer = await Jobpost.findOne({ _id: jobId }).lean();
      if (verifyJobOffer.assign === true) {
        res.json({ error: "This job is already assigned to you." });
      } else {
        const checkFreelancer = await FreelancerDetails.findOne({
          _id: id,
        }).lean();

        let freelancerId = checkFreelancer ? checkFreelancer._id : "";

        if (freelancerId) {
          const newMessage = await new Message({
            sender: sender,
            text: text,
            conversationId: conversationId,
            freelancerId: freelancerId,
            noOfHours: noOfHours,
            fixedPrice: fixedPrice,
            jobId: jobId,
          });

          try {
            const savedMessage = await newMessage.save();
            res.status(200).json(savedMessage);
          } catch (err) {
            res.status(500).json(err);
          }
        }
      }
    } else {
      const checkEmployer = await EmployerDetails.findOne({
        _id: id,
      }).lean();
      let employerId = checkEmployer ? checkEmployer._id : "";
      if (employerId) {
        const newMessage = await new Message({
          sender: sender,
          text: text,
          conversationId: conversationId,
          employerId: employerId,
          noOfHours: noOfHours,
          fixedPrice: fixedPrice,
        });

        try {
          const savedMessage = await newMessage.save();
          res.status(200).json(savedMessage);
        } catch (err) {
          res.status(500).json(err);
        }
      }
    }
  } catch (error) {
    // console.log(error);
  }
});

router.get("/api/messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/api/messages/conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.body.conversationId,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/api/getUser/:id", async (req, res) => {
  const { id } = req.params;

  const getUsers = await User.findOne({ _id: id }).lean();

  res.json({ getUsers });
});

router.post("/api/accept/project", async (req, res) => {
  try {
    const {
      jobId,
      freelancerId,
      employerId,
      noOfHours,
      fixedPrice,
      messageId,
    } = req.body;

    const verifyJobOffer = await Jobpost.findOne({ _id: jobId }).lean();

    const verifyJobInvitation = await FreelancerDetails.findOne({
      _id: freelancerId,
      invitations: {
        $elemMatch: { jobId: jobId },
      },
    });

    if (verifyJobOffer.assign === true) {
      res.json({
        error: "You have already assign this freelancer for this Job.",
      });
    } else {
      const updateJobOfferStatus = await Message.findOneAndUpdate(
        { _id: messageId },
        {
          $set: {
            employerAccept: true,
          },
        }
      );

      if (updateJobOfferStatus) {
        await Jobpost.findOneAndUpdate(
          { _id: jobId },
          {
            $set: {
              assign: true,
              projectStatus: {
                projectDurationHours: noOfHours,
                fixedPrice: fixedPrice,
                assignedFreelancer: freelancerId,
                freelancerStatus: "In Progress",
              },
              sendInvitation: {
                freelancerId: freelancerId,
                freelancerAcceptStatus: true,
              },
            },
          }
        );
        if (verifyJobInvitation) {
          await FreelancerDetails.findOneAndUpdate(
            {
              _id: freelancerId,
              invitations: {
                $elemMatch: { jobId: jobId },
              },
            },
            {
              $set: {
                "invitations.$.jobId": jobId,
                "invitations.$.employerId": employerId,
                "invitations.$.fixedPrice": fixedPrice,
                "invitations.$.noOfHours": noOfHours,
              },
            }
          );
        } else {
          await FreelancerDetails.findOneAndUpdate(
            { _id: freelancerId },
            {
              $push: {
                invitations: {
                  jobId: jobId,
                  employerId: employerId,
                  fixedPrice: fixedPrice,
                  noOfHours: noOfHours,
                },
              },
            }
          );
        }
        res.json({ success: "Offer Accepted Successfully." });
      }
    }
  } catch {
    res.status(400).json({ error: "Accept Project Failed" });
  }
});

router.post("/api/reject/offer", async (req, res) => {
  try {
    const { jobId, messageId } = req.body;

    const verifyJobOffer = await Jobpost.findOne({ _id: jobId }).lean();

    if (verifyJobOffer.assign === true) {
      res.json({
        error: "You have already assign this freelancer for this Job.",
      });
    } else {
      const updateJobOfferStatus = await Message.findOneAndUpdate(
        { _id: messageId },
        {
          $set: {
            employerAccept: false,
          },
        }
      );

      if (updateJobOfferStatus) {
        res.json({ success: "Offer Rejected Successfully." });
      }
    }
  } catch {
    res.status(400).json({ error: "Reject offer failed" });
  }
});

module.exports = router;
