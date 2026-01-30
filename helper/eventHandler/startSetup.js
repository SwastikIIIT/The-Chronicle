'use server'
import { auth } from "@/auth";

const startSetup =async() => {
   try
   {
        const { user } = await auth();
        console.log('User:',user);
        const data=await fetch(`${process.env.BACKEND_URL}/api/auth/user/${user.id}/2fa/setup`);
        const res=await data.json();

        if(res.ok)
        return { success: true, qr:response.qr };
        
        else
         return { success: false, error:response.message };
        
   }
   catch(err)
   {
      return {success:false,message: err.message || "Could not connect to server"};
   }
}

export default startSetup