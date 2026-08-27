const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {

    // ==========================================
    // DEMO MODE
    // ==========================================

    if (process.env.DEMO_MODE === "true") {

      console.log("=================================");
      console.log("DEMO MODE ENABLED");
      console.log("Email sending skipped");
      console.log("OTP:", options.otp);
      console.log("=================================");

      return {
        success: true,
        demo: true,
      };
    }

    // ==========================================
    // REAL EMAIL - LOCAL DEVELOPMENT
    // ==========================================

    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASSWORD
    ) {
      throw new Error("Email credentials not found");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `<p><b>${options.message}</b></p>`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

    return {
      success: true,
      demo: false,
    };

  } catch (error) {

    console.log("Email error:", error.message);

    throw error;
  }
};

module.exports = sendMail;