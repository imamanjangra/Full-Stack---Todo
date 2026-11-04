import {z} from "zod";


export const verifySchema = z.object({
    code : z
    .string()
    .length(6)
})

export type verifySchemaType = z.infer<typeof verifySchema>