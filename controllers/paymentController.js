const axios = require("axios");
const FreelancerDetails = require("../models/freelancerDetails");
const EmployerDetails = require("../models/EmployerDetails");
const payment = require("../models/payment");
const orderid = require("order-id")("key");
const id = orderid.generate();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "suryarathod315@gmail.com",
    pass: "dbrcksiitjnpjdjz",
  },
});

exports.cardTransactions = async (req, res) => {
  try {
    const {
      cardDetails,
      shopperDetails,
      amount,
      firstName,
      lastName,
      email,
      courseId,
    } = req.body;

    const checkFreelancer = await FreelancerDetails.findOne({
      email: email,
    }).lean();

    const checkEmployer = await EmployerDetails.findOne({
      email: email,
    }).lean();

    if (!cardDetails.cardNumber) {
      res.json({ error: "Please enter a Card Number" });
    } else if (cardDetails.cardNumber.length > 16) {
      res.json({
        error: "Card Number Should not be more than 16 Digits",
      });
    } else if (!cardDetails.cardHolder) {
      res.json({ error: "Please enter Card Holder Name" });
    } else if (!cardDetails.expirationMonth) {
      res.json({ error: "Please enter Validity Month" });
    } else if (cardDetails.expirationMonth.length > 2) {
      res.json({ error: "Validity Month Should not more than 2 Digits" });
    } else if (!cardDetails.expirationYear) {
      res.json({ error: "Please enter Validity Year" });
    } else if (cardDetails.expirationYear.length < 4) {
      res.json({ error: "Validity Year should be of 4 Digits only." });
    } else if (cardDetails.expirationYear.length > 4) {
      res.json({
        error: "Validity Year should not more than 4 Digits only.",
      });
    } else if (!cardDetails.securityCode) {
      res.json({ error: "Please enter a CVV" });
    } else if (cardDetails.securityCode.length < 3) {
      res.json({ error: "CVV Code should of 3 Digits only." });
    } else if (cardDetails.securityCode.length > 3) {
      res.json({
        error: "Validity Year should not more than 3 Digits only.",
      });
    } else if (!shopperDetails.fullName) {
      res.json({ error: "Please enter a FullName" });
    } else if (!shopperDetails.email) {
      res.json({ error: "Please enter a Email" });
    } else if (!shopperDetails.zip) {
      res.json({ error: "Please enter a Zip or Postal Code" });
    } else {
      await axios
        .post(
          "https://sandbox.bluesnap.com/services/2/transactions",
          {
            amount: amount,
            softDescriptor: shopperDetails.fullName,
            cardHolderInfo: {
              firstName: firstName,
              lastName: lastName,
              zip: shopperDetails.zip,
            },
            currency: "USD",
            creditCard: {
              expirationYear: cardDetails.expirationYear,
              securityCode: cardDetails.securityCode,
              expirationMonth: cardDetails.expirationMonth,
              cardNumber: cardDetails.cardNumber,
            },
            cardTransactionType: "AUTH_ONLY",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization:
                "Basic QVBJXzE2NDExOTIwMzE2NTAxMTU3OTg0OTY0OkEjckAyNTA0NjkxMyNhcg==",
            },
          }
        )
        .then(async (result) => {
          if (result) {
            const r = result.data;
            let orderId = orderid.getTime(id);
            let date_ob = new Date();

            const paymentData = await payment.create({
              courseId: courseId,
              orderId: orderId,
              transactionDetails: r,
              orderDate: date_ob,
            });

            if (checkFreelancer) {
              const updateTransactionDetails =
                await FreelancerDetails.findOneAndUpdate(
                  {
                    email,
                  },

                  {
                    $push: {
                      purchaseCourses: {
                        courseId: courseId,
                        orderId: orderId,
                        transactionDetails: r,
                        orderDate: date_ob,
                      },
                      notifications: {
                        notificationType: "Course Purchased",
                        notificationMessage:
                          "You have successfully purchased the course.",
                        timeDate: new Date(),
                        seen: false,
                      },
                    },
                  }
                );
            }

            if (checkEmployer) {
              const updateTransactionDetails =
                await EmployerDetails.findOneAndUpdate(
                  {
                    email,
                  },

                  {
                    $push: {
                      purchaseCourses: {
                        courseId: courseId,
                        orderId: orderId,
                        transactionDetails: r,
                        orderDate: date_ob,
                      },
                      notifications: {
                        notificationType: "Course Purchased",
                        notificationMessage:
                          "You have successfully purchased the course.",
                        timeDate: new Date(),
                        seen: false,
                      },
                    },
                  }
                );
            }

            let mailOptions = {
              from: "suryarathod315@gmail.com",
              to: checkEmployer ? checkEmployer.email : checkFreelancer.email,
              subject: "Course Purchased Successfully.",
              html:
                "<h4>Congratulations you have successfully purchase the course.Please go to course page and enroll into the course.</h4>" +
                "<p>Thanks for using Vame.io</p>",
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });

            await paymentData.save((error) => {
              if (error) {
                res.json({ error });
              } else {
                res.json({
                  success: "Payment Successful...",
                  transactionData: r,
                  orderId,
                });
              }
            });
          }
        });
    }
  } catch {
    res.json({ error: "Payment Failed..." });
  }
};

exports.allTransactions = async (req, res) => {
  try {
    const transactionDetails = await payment.find().populate("courseId").lean();
    res.json({ transactionDetails });
  } catch (error) {
    res.status(400).json({ error: "Transaction Details Failed..." });
  }
};

exports.paypalTransactions = async (req, res) => {
  try {
    const { fullName, amount, email, zip, courseId, email1 } = req.body;

    const checkFreelancer = await FreelancerDetails.findOne({
      email: email,
    }).lean();

    const checkEmployer = await EmployerDetails.findOne({
      email: email,
    }).lean();

    if (!fullName) {
      res.json({ error: "Please enter a FullName" });
    } else if (!email1) {
      res.json({ error: "Please enter a Email" });
    } else if (!zip) {
      res.json({ error: "Please enter a Zip or Postal Code" });
    } else {
      if (checkFreelancer) {
        await axios
          .post(
            "https://sandbox.bluesnap.com/services/2/alt-transactions",
            {
              amount: amount,
              softDescriptor: fullName,
              currency: "USD",
              paypalTransaction: {
                cancelUrl: `${process.env.FRONT_URL}/freelancer/order/cancel/${courseId}`,
                returnUrl: `${process.env.FRONT_URL}/freelancer/order/${courseId}`,
                transactionType: "SET_ORDER",
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization:
                  "Basic QVBJXzE2NDExOTIwMzE2NTAxMTU3OTg0OTY0OkEjckAyNTA0NjkxMyNhcg==",
              },
            }
          )
          .then(async (result) => {
            if (result) {
              const r = result.data;
              res.json({ success: "Redirecting to Paypal", r });
            }
          });
      }

      if (checkEmployer) {
        await axios
          .post(
            "https://sandbox.bluesnap.com/services/2/alt-transactions",
            {
              amount: amount,
              softDescriptor: fullName,
              currency: "USD",
              paypalTransaction: {
                cancelUrl: `${process.env.FRONT_URL}/employer/order/cancel/${courseId}`,
                returnUrl: `${process.env.FRONT_URL}/employer/order/${courseId}`,
                transactionType: "SET_ORDER",
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization:
                  "Basic QVBJXzE2NDExOTIwMzE2NTAxMTU3OTg0OTY0OkEjckAyNTA0NjkxMyNhcg==",
              },
            }
          )
          .then(async (result) => {
            if (result) {
              const r = result.data;
              res.json({ success: "Redirecting to Paypal", r });
            }
          });
      }
    }
  } catch {
    res.status(400).json({ error: "Paypal Transaction Failed..." });
  }
};

exports.storeEmployerPaypalDetails = async (req, res) => {
  try {
    const { courseId, email, transactionId, accountId } = req.body;

    const checkEmployer = await EmployerDetails.findOne({
      email: email,
    }).lean();

    let checkPurchaseCourse = await checkEmployer.purchaseCourses
      .map((i, index, elements) => {
        if (i.courseId.toString() === courseId) {
          return elements[index];
        }
      })
      .filter((n) => n);

    if (checkPurchaseCourse.length === 0) {
      let r = {
        transactionId: transactionId,
        accountId: accountId,
        cardHolderInfo: {
          firstName: checkEmployer.firstname,
          lastName: checkEmployer.lastname,
        },
      };
      let orderId = orderid.getTime(id);
      let date_ob = new Date();
      const updateTransactionDetails = await EmployerDetails.findOneAndUpdate(
        {
          email,
        },

        {
          $push: {
            purchaseCourses: {
              courseId: courseId,
              orderId: orderId,
              transactionDetails: r,
              orderDate: date_ob,
            },
          },
        }
      );

      if (updateTransactionDetails) {
        res.json({
          success: "Payment has been Successful",
          slug: "how-to-manage-linkedin-account-1",
        });
      }
    }
  } catch {
    res.status(400).json({ error: "Store Details failed." });
  }
};

exports.storeFreelancerPaypalDetails = async (req, res) => {
  try {
    const { courseId, email, transactionId, accountId } = req.body;

    const checkFreelancer = await FreelancerDetails.findOne({
      email: email,
    }).lean();

    let checkPurchaseCourse = await checkFreelancer.purchaseCourses
      .map((i, index, elements) => {
        if (i.courseId.toString() === courseId) {
          return elements[index];
        }
      })
      .filter((n) => n);

    if (checkPurchaseCourse.length === 0) {
      let r = {
        transactionId: transactionId,
        accountId: accountId,
        cardHolderInfo: {
          firstName: checkFreelancer.firstname,
          lastName: checkFreelancer.lastname,
        },
      };
      let orderId = orderid.getTime(id);
      let date_ob = new Date();
      const updateTransactionDetails = await FreelancerDetails.findOneAndUpdate(
        {
          email,
        },

        {
          $push: {
            purchaseCourses: {
              courseId: courseId,
              orderId: orderId,
              transactionDetails: r,
              orderDate: date_ob,
            },
          },
        }
      );

      if (updateTransactionDetails) {
        res.json({
          success: "Payment has been Successful",
          checkPurchaseCourse,
        });
      }
    }
  } catch {
    res.status(400).json({ error: "Store Details failed." });
  }
};
