import z from "zod";


export const signupSchema = z.object({
    username : z
    .string()
    .min(2 , "Usernae must be atleast 2 characters ")
    .max(20 , "Username must be no more that 20 "),
    // .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , "Username must not contain special character"),

    email : z
    .string()
    .email({message : 'Invalid email address'}),
    
    password : z
    .string()
    .min(6 , {message : "password must be at least 6 char"})
    .max(20 , {message : "password must be at most 20 char"})

})


export type signupSchemaType = z.infer<typeof signupSchema>