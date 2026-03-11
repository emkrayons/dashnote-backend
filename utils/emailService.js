const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset - Dashnote",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #171717; font-weight: 300; font-size: 28px;">Dashnote</h1>
        </div>
        
        <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px;">
          <h2 style="color: #171717; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            You requested to reset your password for your Dashnote account.
          </p>
          <p style="color: #4b5563; line-height: 1.6;">
            Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; 
                      padding: 14px 32px; 
                      background-color: #171717; 
                      color: white; 
                      text-decoration: none; 
                      border-radius: 8px;
                      font-weight: 500;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link in your browser:
          </p>
          <p style="color: #9ca3af; 
                    font-size: 12px; 
                    word-break: break-all; 
                    background-color: white; 
                    padding: 12px; 
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;">
            ${resetUrl}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
            This link will expire in 1 hour. If you didn't request this password reset, 
            please ignore this email and your password will remain unchanged.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} Dashnote. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send reset email");
  }
};

module.exports = { sendPasswordResetEmail };