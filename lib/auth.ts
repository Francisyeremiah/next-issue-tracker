import {compare,hash} from 'bcrypt';
import {nanoid} from 'nanoid';
import { cookies } from 'next/headers';
import {db} from '@/db';
import {users} from '@/db/schema';
import * as jose from 'jose';
import {cache} from 'react';
import { error } from 'console';
import { refresh } from 'next/cache';
import { rejects } from 'assert';

// JWT types (JSON(Javascript Object Notation) Web Token)
interface JWTPayload{
    userId: string
    [key: string]: string | number | boolean | null | undefined
}

// Secret key for JWT signin (in a real App, use an environment variable)
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'aB7xK9mQ2vLp4NzR8tYc1DfGh6JsWu3E'
)

//JWT Expiration Time 
const JWT_EXPIRATION = '7d' //seven days

//Token Refresh threshold(Refresh if less than this time left)
const REFRESH_THRESHOLD = 24 * 60 * 60; // 24 hours in seconds

// Hash a password
export async function hashPassword(password: string){
    return hash(password,10);
}

// verify a password
export async function verifyPassword(password: string,hashedPassword: string){
    return compare(password,hashedPassword);
}

//create a new user
export async function createUser(email: string, password: string){
    const hashedPassword = await hashPassword(password);
    const id = nanoid();

    try{
        await db.insert(users).values({
            id,
            email,
            password: hashedPassword,
        });

        return {id,email};
    }catch(error){
        console.error("Error creating user:", error);
        return null;
    }
}

// Generating a JWT_TOKEN
export async function generateJWT(payload: JWTPayload){
    return await new jose.SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRATION)
        .sign(JWT_SECRET);
}

//verify a JWT_TOKEN
export async function verifyJWT(token: string): Promise<JWTPayload | null>{
    try{
        const {payload} = await jose.jwtVerify(token,JWT_SECRET);
        return payload as JWTPayload;
    }catch(error){
        console.error('JWT Verification failed:',error);
        return null;
    }
}

//Check if token needs refresh
export async function shouldRefreshToken(token: string): Promise<boolean>{
    try{
        const {payload} = await jose.jwtVerify(token,JWT_SECRET,{
            clockTolerance: 15,// 15 seconds tolerance for clock skew
        });

        // get expiration Time
        const exp = payload.exp as number
        const now = Math.floor(Date.now() / 1000)

        //if token expire within the threshold, refresh it
        return exp - now < REFRESH_THRESHOLD
    }catch{
        // If verification failed, token is invalid or expired
        return false
    }
    
}


//Create a session using JWT
export async function createSession(userId: string){
    try{
        // create JWT with user data
        const token = await generateJWT({userId})

        // store JWT in a cookie
        const cookieStore = await cookies()
        cookieStore.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'lax',
        });

        return true;
    }catch(error){
        console.error('Error Creating Session:',error);
        return false;
    }
}

//get current session from JWT
export const getSession = cache(async () => {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if(!token) return null;
        const payload = await verifyJWT(token);
        
        return payload ? {userId: payload.userId}:null
    }catch(error){
        // Handle the specific prerendering error
        if(
            error instanceof Error &&
            error.message.includes('During prerendering, `cookies()` rejects')
        ){
            console.log(
                'Cookies not available during prerendaring, returning null session',
            )
            return null;
        }
        console.error('Error getting session:',error);
        return null;
    }
})

// Delete session by clearing the JWT cookie
export async function deleteSession(){
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
}