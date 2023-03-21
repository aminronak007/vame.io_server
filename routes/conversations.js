const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

router.post("/api/conversations", async (req, res) => {
  const { conversationId, senderId, receiverId } = req.body;

  const conversation1 = await Conversation.findOne({
    members: { $all: [req.body.senderId, req.body.receiverId] },
  });

  if (conversationId === "" || !conversation1) {
    const newConversation = await new Conversation({
      members: [senderId, receiverId],
    });

    try {
      const savedConverstion = await newConversation.save();
      res.status(200).json({ savedConverstion });
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

router.get("/api/conversations/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: {
        $in: [req.params.userId],
      },
    })
      .populate("members.[1]")
      .lean();

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/api/conversations/id", async (req, res) => {
  try {
    const conversation1 = await Conversation.findOne({
      members: {
        $all: [req.body.senderId, req.body.receiverId],
      },
    }).lean();

    res.status(200).json(conversation1);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/api/delete/chat/:conversationId", async (req, res) => {
  const deleteConversation = await Conversation.findOneAndDelete({
    _id: req.params.conversationId,
  }).lean();

  const deleteMsg = await Message.findOneAndDelete({
    conversationId: req.params.conversationId,
  }).lean();

  if (deleteConversation && deleteMsg) {
    res.json({ success: "Conversation is delete successfully." });
  } else {
    res.json({ error: "Conversation Delete failed" });
  }
});

module.exports = router;
