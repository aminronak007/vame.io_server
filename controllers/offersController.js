const JobOffers = require("../models/JobOffers");

exports.addOffers = async (req, res) => {
    try {
        // console.log(req.body);
        const { jobId, freelancerId, employerId, noOfHours, fixedPrice } =
            req.body;

        const verifyJob = await JobOffers.findOne({ jobId: jobId }).lean();

        if (verifyJob) {
            if (freelancerId) {
                await JobOffers.findOneAndUpdate(
                    {
                        jobId: jobId,
                    },
                    {
                        $push: {
                            freeLancerOffers: {
                                freelancerId: freelancerId,
                                fixedPrice: fixedPrice,
                                noOfHours: noOfHours,
                            },
                        },
                    }
                );
            }

            if (employerId) {
                await JobOffers.findOneAndUpdate(
                    {
                        jobId: jobId,
                    },
                    {
                        $push: {
                            employerOffers: {
                                employerId: employerId,
                                fixedPrice: fixedPrice,
                                noOfHours: noOfHours,
                            },
                        },
                    }
                );
            }
        } else {
            if (freelancerId) {
                const addOffers = await JobOffers.create({
                    jobId: jobId,
                    freeLancerOffers: {
                        freelancerId: freelancerId,
                        fixedPrice: fixedPrice,
                        noOfHours: noOfHours,
                    },
                });
                addOffers.save();
            }

            if (employerId) {
                const addOffers = await JobOffers.create({
                    jobId: jobId,
                    employerOffers: {
                        employerId: employerId,
                        fixedPrice: fixedPrice,
                        noOfHours: noOfHours,
                    },
                });

                addOffers.save();
            }
        }
    } catch {
        res.status(400).json({ error: "Add Offers Failed..." });
    }
};
