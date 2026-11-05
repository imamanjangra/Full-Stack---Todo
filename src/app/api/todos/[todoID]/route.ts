import { ApiMessage, ApiResponse } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { updateTodoSchema } from "@/src/Schema/updateTodoSchema";
import TodoModel from "@/src/models/Todo.model";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ todoID: string }> },
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) {
      return ApiMessage(false, "Not authenticated", 401);
    }
    const { todoID } = await params;

    const body = await request.json();
    const result = updateTodoSchema.safeParse(body);

    if (!result.success) {
      return ApiResponse(
        false,
        "Invalid Input",
        result.error.flatten().fieldErrors,
        400,
      );
    }

    const updatedTodo = await TodoModel.findOneAndUpdate(
      {
        _id: todoID,
        userId: session.user._id,
      },
      {
        $set: result.data,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTodo) {
      return ApiMessage(false, "Todo not found", 404);
    }

    return ApiResponse(true, "Todo updated successfully", updatedTodo, 200);
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


export async function DELETE(
  request : Request,
   {params} : {params : Promise<{todoID : string}>}
) {
  
  try {

    await dbConnect();

    const {todoID} = await params;


    const session = await getServerSession(authOptions);

      if (!session) {
      return ApiMessage(false, "Not authenticated", 401);
    }

    const deletedTodo = await TodoModel.findOneAndDelete({
      _id : todoID,
      userId : session.user._id
    })

    if (!deletedTodo) {
      return ApiMessage(false, "Todo not found", 404);
    }

    return ApiResponse(
      true,
      "Todo deleted successfully",
      deletedTodo,
      200
    );

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
