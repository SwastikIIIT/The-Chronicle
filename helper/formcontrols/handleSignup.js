'use server';

export const handleSignup=async(formData)=>{

      const username=formData.get("username");
      const email=formData.get("email");
      const password=formData.get("password");
     
      const response=await fetch(`${process.env.BACKEND_URL}/api/auth/signup`,{
            method:'POST',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({
                username,
                email,
                password,
            })
      })
      const res=await response.json();
      if(!response.ok) throw new Error(res.message || 'Error in signup.')
      
      return { user: res?.user, success: true };  
  }
