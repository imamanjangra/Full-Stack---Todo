import { ApiMessage } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/src/models/user.model";


export async function POST(request : Request){
    await dbConnect();

    try {
        const {username , code} = await request.json();

        const user = await UserModel.findOne({username});

        if(!user){
            return ApiMessage(
                false,
                "user not found",
                404
            )
        }

        const isCodeValid = user.verifyCode === code;;
        const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpire){
            user.isVerfied = true;

            await user.save();

            return ApiMessage(
                true ,
                "Account verified successfully",
                200
            )
        }else if(!isCodeNotExpire) {
            return ApiMessage(
                false,
                "Verification code has expired , Please sign up again to get a new code",
                400
            )
        }
    } catch (error) {
        
    }
}