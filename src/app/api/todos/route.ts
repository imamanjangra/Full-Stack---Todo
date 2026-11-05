import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { ApiMessage, ApiResponse } from "@/lib/apiResponse";
import { TodoSchema } from "@/src/Schema/todoSchema";
import TodoModel from "@/src/models/Todo.model";
import UserModel from "@/src/models/user.model";



export async function POST(request : Request){
    await dbConnect();

      const body = await request.json();
      const result = TodoSchema.safeParse(body);
    
        if (!result.success) {
          return ApiResponse(
            false,
            "Invalid Input",
            result.error.flatten().fieldErrors,
            400,
          );
        }

    const {content , isCompeleted , Priority} = result.data;

    const session = await getServerSession(authOptions);


    if(!session ){
        return ApiMessage(
            false,
            "Not authenticated",
            401
        )
    }

    try {

        const user = await UserModel.findById(session.user._id);

        if(!user){
            return ApiMessage(
                false ,
                "User not found",
                404
            )
        }


        const todos = await TodoModel.create({
            content,
            isCompeleted,
            Priority,
            userId : session.user._id
        })


        await todos.save();

        return ApiResponse(
            true, 
            "todo created successfully",
            todos,
            200
        )

    } catch (error) {
    console.error("Error registering user:", error);

    return ApiResponse(
      false,
      "Error crating todo",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );

    }
}


export async function GET(request : Request) {
    await dbConnect();

     const session = await getServerSession(authOptions);


    if(!session ){
        return ApiMessage(
            false,
            "Not authenticated",
            401
        )
    }

    try {
        const user = await UserModel.findById(session.user._id);

        const Todos = await TodoModel.find({userId : user?._id});

        return ApiResponse(
            true,
            "Todo fetch successfully",
            Todos,
            200
        )
    } catch (error) {
         console.error("Error registering user:", error);

    return ApiResponse(
      false,
      "Error crating todo",
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
    }

}