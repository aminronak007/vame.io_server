const mongoose = require("mongoose");

const employerDeletedAccount = mongoose.Schema(
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
    "EmployersDeletedAccounts",
    employerDeletedAccount
);
