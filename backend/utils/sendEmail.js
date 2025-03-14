const nodemailer = require("nodemailer");

/**
 * TODO:
 * - Configure Nodemailer transporter with environment variables.
 * - Define a function to send an email with provided email details.
 * - Set email options including sender, recipient, subject, and message.
 * - Handle errors when sending emails and log them appropriately.
 * - Export the function for use in other modules.
 */

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject,
      html: message,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent.");
  }
};

module.exports = sendEmail;
