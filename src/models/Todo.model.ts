import mongoose , {Schema , Document} from "mongoose";
export interface Todos extends Document{
    isCompeleted : boolean,
    content : string,
    Priority : "Low" | "Medium" | "High",
    userId : mongoose.Types.ObjectId
}
const TodoSchema : Schema<Todos> = new Schema({
    isCompeleted : {
        type : Boolean,
        required : true,
        default : false,
    },
    content : {
        type : String,
        required : true,
    },
    Priority : {
        type : String,
        enum : ["Low" , "Medium" , "High"],
        default : "Medium"
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
})

const TodoModel = (mongoose.models.Todos as mongoose.Model<Todos>) || (mongoose.model<Todos>("Todo" , TodoSchema));

export default TodoModel;