'use server';
import { signOut } from "@/auth";
import { cookies } from "next/headers";

export const handleSignout = async()=>{
    
    try{
        const Cookies = await cookies();
        Cookies.delete("backend_token");
        await signOut();
    }
    catch(err)
    {
        console.log("Error in signout:",err);
        // throw new Error(err?.message);
    }
}