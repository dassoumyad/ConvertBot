const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    // Check email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email credentials not found");
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email details
    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: options.email,

      subject: options.subject,

      text: options.message,

      html: `<p><b>${options.message}</b></p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email error:", error.message);

    throw error;
  }
};

module.exports = sendMail;