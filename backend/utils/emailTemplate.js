// TODO: Verification OTP Email Template  
// - Create a visually distinct OTP display for easy readability  
// - Ensure the OTP is valid for 15 minutes and mention it clearly  
// - Use a professional, dark-themed email design  
// - Add a disclaimer that the OTP should not be shared  
// - Ensure the email is responsive and properly formatted  

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

// TODO: Forgot Password Email Template  
// - Provide a secure password reset link with a clear CTA button  
// - Mention the expiration time of 15 minutes  
// - Ensure the email is visually appealing and matches branding  
// - Include a fallback display of the reset URL in case the button doesn’t work  
// - Add a disclaimer that the link should not be shared  

const generateForgotPasswordEmailTemplate = (resetPasswordUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #000; color: #fff;">
      
      <h2 style="color: #fff; text-align: center;">Reset Your Password</h2>
      
      <p style="font-size: 16px; color: #ccc;">Dear User,</p>
      
      <p style="font-size: 16px; color: #ccc;">
        You requested to reset your password. Please click the button below to reset your password:
      </p>
  
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetPasswordUrl}" 
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
      <p style="font-size: 16px; color: #fff; word-wrap: break-word; ">${resetPasswordUrl}</p>
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
