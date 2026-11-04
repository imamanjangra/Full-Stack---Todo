import mongoose , {Schema , Document} from "mongoose";
import { Todos } from "./Todo.model";


export interface User extends Document{
    username : string,
    email : string,
    password : string,
    verifyCodeExpiry : Date,
    verifyCode : string,
    isVerfied : boolean,
    todos :  mongoose.Types.ObjectId
}

const UserSchema : Schema<User> = new Schema({
     username : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },

    email : {
        type : String,
        required : true,
        unique : true,
        match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , 'please use a valid email'],
        // trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },

    verifyCode : {
         type : String,
    },

    verifyCodeExpiry : {
        type : Date,
    },

    isVerfied : {
        type : Boolean,
        default : false
    },

    todos : {
        type : Schema.Types.ObjectId,
        ref : "Todo",
       
    }
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema))

export default UserModel;