import NextAuth from "next-auth";

declare module "next-auth"{
    interface User{
        username : string,
        isverified : boolean
    }

    interface Session {
        user : {
            _id : string,
            useranme : string,
            isVerified : boolean
        } & DefaultSession["User"];
    }
}


declare module "next-auth/jwt"{
    interface JWT {
        _id: string;
        username: string;
        isVerified: boolean;
    }
}