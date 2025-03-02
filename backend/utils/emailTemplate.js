// TODO: Generate an email template for sending verification OTP to users
const generateVerificationOtpEmailTemplate = (otpCode) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #000; color: #fff;">
      
      <h2 style="color: #fff; text-align: center;">Verify Your Email Address</h2>
      
      <p style="font-size: 16px; color: #ccc;">Dear User,</p>
      
      <p style="font-size: 16px; color: #ccc;">
        To complete your registration or login, please use the following verification code:
      </p>
  
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #000; padding: 10px 20px; border: 1px solid #fff; border-radius: 5px; background-color: #fff;">
          ${otpCode}
        </span>
      </div>
  
      <p style="font-size: 16px; color: #ccc;">
        This code is valid for 15 minutes. Please do not share it with anyone.
      </p>
  
      <p style="font-size: 16px; color: #ccc;">
        If you did not request this email, please ignore it.
      </p>
  
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>Thank you, <br>Bookworm Team</p>
  
        <p style="font-size: 12px; color: #444;">
          This is an automated message. Please do not reply to this email.
        </p>
      </footer>
    </div>`;
};

// TODO: Generate a Forgot Password email template for sending the reset password URL to users

const generateForgotPasswordEmailTemplate = (resetPassword) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #000; color: #fff;">
      
      <h2 style="color: #fff; text-align: center;">Reset Your Password</h2>
      
      <p style="font-size: 16px; color: #ccc;">Dear User,</p>
      
      <p style="font-size: 16px; color: #ccc;">
        To reset your password, please click the link below:
      </p>
  
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetPassword}" 
          style="display: inline-block; font-size: 16px; font-weight: bold; color: #000; text-decoration: none; padding: 12px 20px; border: 3px solid #fff; border-radius: 5px; background-color: #fff;">
          Reset Password
        </a>
      </div>
  
      <p style="font-size: 16px; color: #ccc;">
        This link is valid for 15 minutes. Please do not share it with anyone.
      </p>
  
      <p style="font-size: 16px; color: #ccc;">
        If you did not request this email, please ignore it.
      </p>

      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>Thank you, <br>Bookworm Team</p>
  
        <p style="font-size: 12px; color: #444;">
          This is an automated message. Please do not reply to this email.
        </p>
      </footer>
    </div>
  `;
};

module.exports = {
  generateVerificationOtpEmailTemplate,
  generateForgotPasswordEmailTemplate,
};
