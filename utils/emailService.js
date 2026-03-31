const { Resend } = require('resend');

// Send password reset email using Resend
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not set!");
      throw new Error("RESEND_API_KEY environment variable is not configured");
    }
    
    if (!process.env.FRONTEND_URL) {
      console.error("❌ FRONTEND_URL is not set!");
      throw new Error("FRONTEND_URL environment variable is not configured");
    }

    console.log("✅ Environment variables check:");
    console.log("  - RESEND_API_KEY:", process.env.RESEND_API_KEY ? "Set (hidden)" : "NOT SET");
    console.log("  - FRONTEND_URL:", process.env.FRONTEND_URL);

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log("📧 Sending email via Resend to:", email);

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Dashnote <onboarding@resend.dev>', // Using Resend's free domain
      to: email,
      subject: 'Password Reset - Dashnote',
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
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log("✅ Password reset email sent successfully!");
    console.log("  - Email ID:", data.id);
    console.log("  - To:", email);
    console.log("  - Reset URL:", resetUrl);

    return data;

  } catch (error) {
    console.error("❌ DETAILED EMAIL ERROR:");
    console.error("  - Error message:", error.message);
    console.error("  - Error:", error);

    if (error.message.includes("environment variable")) {
      throw error;
    } else {
      throw new Error(`Failed to send reset email: ${error.message}`);
    }
  }
};

module.exports = { sendPasswordResetEmail };