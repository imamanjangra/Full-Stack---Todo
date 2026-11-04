
import VerificationEmail from "@/emails/verificationEmail";
import { resend } from "@/lib/resend";

export async function SendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
) {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (response.error) {
      return {
        success: false,
        message: response.error.message,
      };
    }

    return {
      success: true,
      message: "Verification email sent successfully",
    };

  } catch (error) {
    console.error("Error sending verification email:", error);

    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Failed to send verification email",
    };
  }
}
