const generateVerificationOtpEmailTemplate = require("./emailTemplate");
const sendEmail = require("./sendEmail"); // Ensure this function is correctly imported
// const generateVerificationOtpEmailTemplate = require("./emailTemplate"); // Import the template function

// TODO: Function to send a verification code via email
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
    console.error("Error sending verification code:", error); //Log the error for debugging

    return res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
};

// TODO: Export the function for use in other files
module.exports = { sendVerificationCode };
