import {z} from "zod";


export const TodoSchema = z.object({
    content : z
    .string()
    .min(5 , {message : 'Content must be at least of 5 char '})
    .max(1000 , {message : 'Content must be at most 1000 characters'}),

    isCompeleted : z
    .boolean()
    .optional(),

    Priority : z
    .enum(["Low" , "Medium" , "High"])
    .optional(),


})

export type TodoSchemaType = z.infer<typeof TodoSchema>