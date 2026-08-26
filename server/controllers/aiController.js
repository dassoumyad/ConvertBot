const axios = require("axios");

const EmailHistory = require("../models/EmailHistory");


// ======================================
// GENERATE EMAIL
// ======================================

exports.generateEmail = async (req, res) => {

  try {

    // Get prompt from frontend
    const { prompt } = req.body;


    // Check prompt
    if (!prompt) {

      return res.status(400).json({
        message: "Prompt is required"
      });

    }


    // ======================================
    // Send request to Groq
    // ======================================

    const response = await axios.post(

      "https://api.groq.com/openai/v1/chat/completions",

      {

        model: "openai/gpt-oss-120b",

        messages: [

          {
            role: "system",

            content: `
You are an expert cold email writer.

Generate the following:

1. A short email subject
2. A professional cold email
3. A LinkedIn DM
4. A short follow-up email

Make everything:

- Personalized
- Professional
- Concise
- Natural
- Not robotic

Return the answer in exactly this format:

SUBJECT:
...

EMAIL:
...

LINKEDIN:
...

FOLLOW_UP:
...
`
          },


          {
            role: "user",

            content: prompt
          }

        ],


        temperature: 0.7,

        max_tokens: 1000,

        include_reasoning: false

      },


      {

        headers: {

          "Content-Type": "application/json",

          Authorization:
            `Bearer ${process.env.GROQ_API_KEY}`

        }

      }

    );


    // ======================================
    // Get AI response
    // ======================================

    const aiResponse =
      response.data.choices[0].message.content;


    console.log("AI RESPONSE:");
    console.log(aiResponse);


    // ======================================
    // Extract SUBJECT
    // ======================================

    const subject =
      aiResponse
        .split("EMAIL:")[0]
        .replace("SUBJECT:", "")
        .trim();


    // ======================================
    // Extract EMAIL
    // ======================================

    const emailBody =
      aiResponse
        .split("EMAIL:")[1]
        ?.split("LINKEDIN:")[0]
        ?.trim() || "";


    // ======================================
    // Extract LINKEDIN
    // ======================================

    const linkedinDM =
      aiResponse
        .split("LINKEDIN:")[1]
        ?.split("FOLLOW_UP:")[0]
        ?.trim() || "";


    // ======================================
    // Extract FOLLOW UP
    // ======================================

    const followUpEmail =
      aiResponse
        .split("FOLLOW_UP:")[1]
        ?.trim() || "";


    // ======================================
    // Save to MongoDB
    // ======================================

    const history = await EmailHistory.create({

      user: req.user.id,

      prompt,

      subject,

      emailBody,

      linkedinDM,

      followUpEmail

    });


    // ======================================
    // Send response to frontend
    // ======================================

    return res.status(200).json({

      message: "Email generated successfully",

      data: {

        subject,

        emailBody,

        linkedinDM,

        followUpEmail

      },

      historyId: history._id

    });


  } catch (error) {

    console.log(
      "AI Error:",
      error.response?.data || error.message
    );


    return res.status(500).json({

      message: "Failed to generate email"

    });

  }

};



// ======================================
// GET EMAIL HISTORY
// ======================================

exports.getEmailHistory = async (req, res) => {

  try {

    // Get only logged-in user's history
    const history =
      await EmailHistory
        .find({
          user: req.user.id
        })
        .sort({
          createdAt: -1
        });


    return res.status(200).json({

      message: "Email history fetched successfully",

      data: history

    });


  } catch (error) {

    console.log(
      "History Error:",
      error.message
    );



    return res.status(500).json({

      message: "Failed to fetch email history"

    });


  }

};

// ======================================
// DELETE EMAIL HISTORY
// ======================================

exports.deleteEmailHistory = async (req, res) => {
  try {

    const { id } = req.params;

    // Find history belonging to logged-in user
    const history = await EmailHistory.findOne({
      _id: id,
      user: req.user.id
    });

    // History not found
    if (!history) {
      return res.status(404).json({
        message: "Email history not found"
      });
    }

    // Delete history
    await EmailHistory.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Email history deleted successfully"
    });

  } catch (error) {

    console.log(
      "Delete History Error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to delete email history"
    });

  }
};