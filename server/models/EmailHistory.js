const mongoose = require("mongoose");


const EmailHistorySchema = new mongoose.Schema(

  {

    // Which user generated this email?
    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true

    },


    // User's original prompt
    prompt: {

      type: String,

      required: true

    },


    // AI generated subject
    subject: {

      type: String,

      required: true

    },


    // AI generated email
    emailBody: {

      type: String,

      required: true

    },


    // AI generated LinkedIn message
    linkedinDM: {

      type: String,

      required: true

    },


    // AI generated follow-up
    followUpEmail: {

      type: String,

      required: true

    }

  },

  {

    timestamps: true

  }

);


const EmailHistory =
  mongoose.model(
    "EmailHistory",
    EmailHistorySchema
  );


module.exports = EmailHistory;