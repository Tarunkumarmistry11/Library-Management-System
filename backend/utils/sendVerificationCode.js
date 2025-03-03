const generateVerificationOtpEmailTemplate = require("./emailTemplate");
const sendEmail = require("./sendEmail"); 

/**
 * TODO:
 * - Generate an email template for the verification code.
 * - Send the verification code via email using the `sendEmail` function.
 * - Return a success response if the email is sent successfully.
 * - Handle errors gracefully and return an appropriate response.
 */

const sendVerificationCode = async (verificationCode, email, res) => {
  try {
    const message = generateVerificationOtpEmailTemplate(verificationCode);

    await sendEmail({
      email,
      subject: "Verification Code (BookWorm Library Management System)",
      message,
    });

    return res.status(200).json({
      success: true, //Changed false -> true for successful response
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification code:", error); 

    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
};

module.exports = { sendVerificationCode };
