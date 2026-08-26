const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "ConvertBot <onboarding@resend.dev>",
      to: [options.email],
      subject: options.subject,
      html: `<p>${options.message}</p>`,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Email error:", error.message);
    throw error;
  }
};

module.exports = sendMail;