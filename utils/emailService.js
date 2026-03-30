const nodemailer = require("nodemailer");

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER) {
      console.error("❌ EMAIL_USER is not set!");
      throw new Error("EMAIL_USER environment variable is not configured");
    }
    
    if (!process.env.EMAIL_PASSWORD) {
      console.error("❌ EMAIL_PASSWORD is not set!");
      throw new Error("EMAIL_PASSWORD environment variable is not configured");
    }
    
    if (!process.env.FRONTEND_URL) {
      console.error("❌ FRONTEND_URL is not set!");
      throw new Error("FRONTEND_URL environment variable is not configured");
    }

    console.log("✅ Environment variables check:");
    console.log("  - EMAIL_USER:", process.env.EMAIL_USER);
    console.log("  - EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Set (hidden)" : "NOT SET");
    console.log("  - FRONTEND_URL:", process.env.FRONTEND_URL);

    // Create transporter with better config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD.replace(/\s/g, ''), // Remove any spaces
      },
      debug: true, // Enable debug output
      logger: true, // Log to console
    });

    // Verify transporter configuration
    console.log("🔍 Verifying email configuration...");
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Dashnote" <${process.env.EMAIL_USER}>`,
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
      text: `
        Reset Your Password - Dashnote
        
        You requested to reset your password for your Dashnote account.
        
        Click the link below to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this password reset, please ignore this email.
        
        © ${new Date().getFullYear()} Dashnote
      `,
    };

    console.log("📧 Sending email to:", email);
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Password reset email sent successfully!");
    console.log("  - Message ID:", info.messageId);
    console.log("  - To:", email);
    console.log("  - Reset URL:", resetUrl);

    return info;

  } catch (error) {
    console.error("❌ DETAILED EMAIL ERROR:");
    console.error("  - Error message:", error.message);
    console.error("  - Error code:", error.code);
    console.error("  - Error name:", error.name);
    console.error("  - Full error:", error);

    // Provide specific error messages
    if (error.code === "EAUTH") {
      console.error("⚠️  Authentication failed - Check your Gmail App Password!");
      throw new Error("Email authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD environment variables.");
    } else if (error.code === "ESOCKET") {
      console.error("⚠️  Network error - Cannot connect to Gmail servers!");
      throw new Error("Network error. Unable to connect to email server.");
    } else if (error.message.includes("Invalid login")) {
      console.error("⚠️  Invalid credentials - Gmail rejected the login!");
      throw new Error("Invalid email credentials. Please regenerate your Gmail App Password.");
    } else if (error.message.includes("environment variable")) {
      throw error; // Re-throw env variable errors as-is
    } else {
      console.error("⚠️  Unknown email error!");
      throw new Error(`Failed to send reset email: ${error.message}`);
    }
  }
};

module.exports = { sendPasswordResetEmail };