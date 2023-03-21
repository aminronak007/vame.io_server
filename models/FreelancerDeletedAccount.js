const mongoose = require("mongoose");

const freelancerDeletedAccount = mongoose.Schema(
    {
        email: {
            type: String,
        },
        reasonToDelete: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "FreelancerDeletedAccounts",
    freelancerDeletedAccount
);
