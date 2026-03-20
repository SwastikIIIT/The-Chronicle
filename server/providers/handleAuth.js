'use server';

import { signIn } from "@/auth";

export const handleAuth=async(provider)=>{
        if(provider=='google') await signIn('google');
        if(provider=='github') await signIn('github');    
}