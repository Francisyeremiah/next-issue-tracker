"use client"
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    Form,
    FormGroup,
    FormLabel,
    FormInput,
    FormError, 
} from "@/components/ui/Form";
import Link from "next/link";
import toast from 'react-hot-toast';
import { signUp, signIn, ActionResponse } from "@/app/actions/auth";

const initialState : ActionResponse = {
    success: false,
    message: '',
    errors: undefined,
}

export default function SignUpPage(){
    const router = useRouter();

    // Use useActionState Hook for the form admission action 
    const [state, formAction, isPending] = 
        useActionState<ActionResponse, FormData> (async(
            prevState: ActionResponse, formData: FormData
        ) => {
            try{
                const result = await signUp(formData);
                // Handle successfuly submission
                if (result.success){
                    toast.success('Account created Successfully');
                    router.push('/dashboard');
                }

                return result;
            }catch(error){
                return {
                    success: false,
                    message: (error as Error).message || 'An error occured',
                    errors: undefined,
                }
            }
        },initialState);


    return (
        <div 
            className="min-h-screen flex flex-col justify-center py-12 
            sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#121212]"
        >
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 
                    className="text-center text-3xl font-extrabold text-gray-900 
                    dark:text-white"
                >
                    Mode
                </h1>
                <h2 
                    className="mt-2 text-center text-2xl font-bold text-gray-900 
                    dark:text-white"
                >
                    Create a New Account.
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div 
                    className="bg-white dark:bg-[#1a1a1a] py-8 px-4 shadow 
                    sm:rounded-lg sm:px-10 border border-gray-100 dark:borde-gray-50"
                >
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an Account?{' '}
                            <Link
                                href="/signin"
                                className="font-medium text-gray-900 hover:text-gray-700 
                                dark:text-gray-300 dark:hover:text-gray-100"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div 
                    className="bg-white dark:bg-[#1a1a1a] py-8 px-4 shadow 
                    sm:rounded-lg sm:px-10 border border-gray-100 dark:borde-gray-50"
                >
                <Form action={formAction} className="space-y-6">
                {state?.message && !state.success && (<FormError>{state.message}</FormError>)}
                
                <FormGroup>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormInput
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        disabled={isPending}
                        arial-describedby="email-error"
                        className={state?.errors?.email ? 'border-red-500' : ''}
                    />
                    {state?.errors?.email && (
                        <p id="email-error" className="text-sm text-red-500">
                            {state.errors.email[0]}
                        </p>
                    )}
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormInput
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        disabled={isPending}
                        arial-describedby="password-error"
                        className={state?.errors?.password ? 'border-red-500' : ''}
                    />
                    {state?.errors?.password && (
                        <p id="password-error" className="text-sm text-red-500">
                            {state.errors.password[0]}
                        </p>
                    )}
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <FormInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type="confirmPassword"
                        autoComplete="new-password"
                        required
                        disabled={isPending}
                        arial-describedby="confirmPassword-error"
                        className={state?.errors?.confirmPassword ? 'border-red-500' : ''}
                    />
                    {state?.errors?.confirmPassword && (
                        <p id="confirmPassword-error" className="text-sm text-red-500">
                            {state.errors.confirmPassword[0]}
                        </p>
                    )}
                </FormGroup>
                <div className="flex flex-col items-center justify-center">
                    <Button type="submit" className="">Sign Up</Button>
                </div>
                </Form>
                </div>
            </div>
        </div>
    );
}