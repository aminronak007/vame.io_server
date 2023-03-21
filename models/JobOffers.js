const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const jobOffersSchema = mongoose.Schema(
    {
        jobId: {
            type: ObjectId,
            ref: "JobPost",
        },
        freeLancerOffers: [
            {
                freelancerId: {
                    type: ObjectId,
                    ref: "FreelancerDetails",
                },
                noOfHours: {
                    type: Number,
                },
                fixedPrice: {
                    type: Number,
                },
                accept: {
                    type: Boolean,
                },
            },
        ],
        employerOffers: [
            {
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
                accept: {
                    type: Boolean,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("JobOffers", jobOffersSchema);
