import {z} from "zod";

const UserSchema = z.object({
    name: z.string(),
    age: z.number()
        .min(0,'Age can not be less than 0')
        .max(120,'Age can not be more than 120')
});

// This runs at run time
const result = UserSchema.safeParse({name: 'Alice', age: -25});

if (result.success){
    console.log("Valid User:",result.data);
}else{
    console.log("Validation failed:",result.error.message);
}