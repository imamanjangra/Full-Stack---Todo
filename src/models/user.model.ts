import mongoose , {Schema , Document} from "mongoose";

export interface Todos extends Document{
    isCompeleted : boolean,
    content : string,
    Priority : "Low" | "Medium" | "High"
}



export interface User extends Document{
    username : string,
    name : string,
    email : string,
    password : string,
    verifyCodeExpiry : Date,
    verifyCode : string,
    isVerifyed : boolean,
}

