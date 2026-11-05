import { ApiMessage, ApiResponse } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import { signupSchema } from "@/src/Schema/signupSchema";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse(
        false,
        "Invalid Input",
        result.error.flatten().fieldErrors,
        400,
      );
    }
    const { username, email, password } = result.data;

    await dbConnect();
    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerfied: true,
    });

    if (existingVerifiedUsername) {
      return ApiMessage(false, "Useraname is alreay taken", 400);
    }

    const verifyCode = crypto.randomInt(100000, 1000000).toString();

    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail?.isVerfied) {
      return ApiMessage(false, "User is already exists with this Email", 400);
    }
    if (existingUserByEmail) {
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;

      await existingUserByEmail.save();
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerfied: false,
      });

      await newUser.save();
    }

    const emailResponse = await SendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse?.success) {
      return ApiResponse(
        false,
        "Email sending failed",
        emailResponse?.message ?? "Unknown email error",
        400,
      );
    }
    return ApiMessage(
      true,
      "User registered successfully. Please verify your email.",
      200,
    );
  } catch (error) {
    console.error("Error registering user:", error);

    return ApiResponse(
      false,
      "Error registering use",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
}
