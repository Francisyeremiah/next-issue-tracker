"use server"

import {z} from "zod";
import {
    verifyPassword,
    createSession,
    createUser,
    deleteSession,
} from '@/lib/auth';
import {getUserByEmail} from '@/lib/dal';
import { mockDelay } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getFallbackRouteParams } from "next/dist/server/request/fallback-params";

// Define Zod schema for Signin Validation
const SignInSchema = z.object({
    email: z.string()
        .min(1,'email is Required')
        .email('Invalid Email format'),
});

// Define Zod schema for signUp validation
const SignUpSchema = z.object({
        email: z.string()
            .min(1,'email is Required')
            .email('Invalid email format'),
        password: z.string()
            .min(1,"Password is Required"),
        confirmPassword: z.string()
            .min(1,"Confirm Password is Required")
}).refine((data) => data.password === data.confirmPassword,{
    message: "Passwords don't match",
    path: ['confirmPassword']
})

export type SignInData = z.infer<typeof SignInSchema>
export type SignUpData = z.infer<typeof SignUpSchema>

export type ActionResponse = {
    success: boolean
    message: string
    errors?: Record<string,string[]>
    error?: string
}

export const signIn = async(formData: FormData): 
    Promise<ActionResponse> => {
    try{
        await mockDelay(300);

        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string 
        }

        const validationResult = SignInSchema.safeParse(data);
        if (!validationResult.success){
            return {
                success : false,
                message: "Validation Failed",
                errors: validationResult.error.flatten().fieldErrors,
            }
        }

        const user = await getUserByEmail(data.email);
        if(!user){
            return {
                success: false,
                message: "Invalid email or password",
                errors: {
                    email: ['Invalid email or password'],
                }
            }
        }

        const isPasswordValid = await verifyPassword(data.password, user.password);
        if(!isPasswordValid){
            return {
                success: false,
                message: "Invalid email or password",
                errors: {
                    password: ['Invalid email or password']
                }
            }
        }

        await createSession(user.id)

        return {
            success: true,
            message: "Signed In successfully"
        }
    }catch(error){
        console.error("Sign In error:",error)
        return {
            success: false,
            message: "An error occured while Signing In",
            error: "Failed to Sign In"
        }
    }
}

export const signUp = async (formData: FormData): Promise<ActionResponse> =>{
    try{
        await mockDelay(300);
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        const validationResult = SignUpSchema.safeParse(data);
        if (!validationResult.success){
            return {
                success: false,
                message: 'Validation Failed',
                errors: validationResult.error.flatten().fieldErrors,
            }
        }

        const existingUser = await getUserByEmail(data.email);
        if (!existingUser){
            return {
                success: false,
                message: 'failed to create User',
                error: 'failed to create User',
            }
        }

        const user = await createUser(data.email, data.password);
        if(!user){
            return {
                success: false,
                message: 'Failed to create User',
                error: 'Failed to create User', 
            }
        }

        await createSession(user.id);

        return {
            success: true,
            message: 'Account created Successfully',
        }

    }catch(error){
        console.error('Sign Up error:',error)
        return {
            success: false,
            message: 'An error occured while creating your Account',
            error: 'Failed to create Account',
        }
    }
}

export const signOut = async () => {
    try{
        await mockDelay(300);
        await deleteSession();
    }catch(error){
        console.error('Sign Out Error:',error);
        throw new Error(`Failed to delete session : ${error}`)
    }finally{
        redirect('/signIn');
    }
}