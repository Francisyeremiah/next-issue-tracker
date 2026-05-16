import {db} from '@/db';
import {getSession} from './auth';
import {eq} from 'drizzle-orm';
import {cache} from 'react';
import {issues,users} from '@/db/schema';
import {mockDelay} from './utils';
import { unstable_cacheTag as cacheTag} from 'next/cache';

// Current user
export const getCurrentUser = cache(async() => {
    const session = await getSession();
    if(!session) return null;

    // Skip database query during pre-rendering if we do not have a session
    if (
        typeof window === 'undefined' &&
        process.env.NEXT_PHASE === 'phase-production-build'
    ){
        return null;
    }

    await mockDelay(700);
    try{
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id,session.userId));
        return result[0] || null;
    }catch(error){
        console.error('Error getting user by Id:',error)
        return null;
    }
});

// Get user by Email
export const getUserByEmail = cache(async(email: string) => {
    try{
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email,email));
        return result[0] || null
    }catch(error){
        console.error('Error getting user by Email:',error);
        return null;
    }
});

// Fetcher functions for React query
export async function getIssue(id: number){
    try{
        await mockDelay(700);

        const result = await db
            .query
            .issues
            .findFirst({
                where: eq(issues.id,id),
                with: {
                    user: true,
                }
            });
        return result 
    }catch(error){
        console.error(`Error fetching Issues ${id}`,error);
        throw new Error('Failed to fetch issue');
    }
}

// Get Issues
export async function getIssues(){
    'use cache'
    cacheTag("issues");
    try{
        await mockDelay(700);
        const result = await db
            .query
            .issues
            .findMany({
                with: {
                    user: true,
                },
                orderBy: (issues,{desc}) => [desc(issues.createdAt)],
            });
        return result;
    }catch(error){
        console.error('Error Fetching Issues:',error);
        throw new Error("Failed to fetch Issues");
    }
}