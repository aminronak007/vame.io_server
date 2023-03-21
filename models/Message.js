const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const MessageSchema = mongoose.Schema(
    {
        conversationId: {
            type: String,
        },
        sender: {
            type: String,
        },
        text: {
            type: String,
        },
        freelancerId: {
            type: ObjectId,
            ref: "FreelancerDetails",
        },
        jobId: {
            type: ObjectId,
            ref: "JobPost",
        },
        employerId: {
            type: ObjectId,
            ref: "EmployerDetails",
        },
        noOfHours: {
            type: Number,
        },
        fixedPrice: {
            type: Number,
        },
        employerAccept: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
