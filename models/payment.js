const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const paymentSchema = mongoose.Schema({
  courseId: {
    type: ObjectId,
    ref: "Courses",
  },
  orderId: {
    type: Number,
  },
  orderDate: {
    type: String,
  },

  transactionDetails: {
    amount: {
      type: Number,
    },
    transactionId: {
      type: String,
    },
    cardTransactionType: {
      type: String,
    },
    usdAmount: {
      type: Number,
    },
    vaultedShopperId: {
      type: Number,
    },
    softDescriptor: {
      type: String,
    },
    currency: {
      type: String,
    },
    cardHolderInfo: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      zip: {
        type: String,
      },
    },
    creditCard: {
      binCategory: {
        type: String,
      },
      binNumber: {
        type: Number,
      },
      cardCategory: {
        type: String,
      },
      cardLastFourDigits: {
        type: Number,
      },
      cardRegulated: {
        type: String,
      },
      cardSubType: {
        type: String,
      },
      cardType: {
        type: String,
      },
      expirationMonth: {
        type: Number,
      },
      expirationYear: {
        type: Number,
      },
      issuingBank: {
        type: String,
      },
      issuingCountryCode: {
        type: String,
      },
    },
    processingInfo: {
      authorizationCode: {
        type: Number,
      },
      avsResponseCodeAddress: {
        type: String,
      },
      avsResponseCodeName: {
        type: String,
      },
      avsResponseCodeZip: {
        type: String,
      },
      cvvResponseCode: {
        type: String,
      },
      processingStatus: {
        type: String,
      },
    },
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
