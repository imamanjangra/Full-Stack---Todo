import dbConnect from "@/lib/dbConnect";
import UserModel from "@/src/models/user.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {

  providers: [

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email || Username",
          type: "email | username",
          placeholder: "Enter your emai or username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email ");
          }

          if (!user.isVerfied) {
            throw new Error("Please verify your account before loggin in ");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

   ],

   callbacks : {
    async jwt({token , user}){
        if(user){
            token._id = user.id;
            token.username = user.username;
            token.isVerified = user.isverified;
        }

        return token
    },

    async session({session , token}){
        if(session.user){
            session.user._id = token._id;
            session.user.username = token.username;
            session.user.isVerified = token.isVerified;
        }

        return session;
    },

   },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,


  pages: {
    signIn: "/sign-in",
  },
};
