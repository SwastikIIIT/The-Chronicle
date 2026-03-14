'use server'
import { cookies } from "next/headers";

export async function getCookies(){
     const Cookies = await cookies();
     const cookie = Cookies.get("backend_token")?.value;
     return cookie;
} 

export const handleSignup=async(formData)=>{
    try
    {
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
      if(!response.ok) throw new Error(res?.message || 'Error in signup.')
      
      return { user: res?.user, success: true }; 
    }
    catch(err)
    {
        console.error(err);
        return { error:res?.error};
    } 
}

export const fetchUserInfo = async () => {
  try {
    const cookie=await getCookies();
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/user`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           Cookie: `backend_token=${cookie}`,
        },
      }
    );

    const data = await response.json();
   
    if (!response.ok) throw new Error(data?.error);

    return {
      userData: data.user,
      auditTrail: data.loginHistory,
      message: data.message,
    };
  } 
  catch (err) {
    console.error(err);
    return { error : err?.message || "Could not load user info"};
  }
};

export const biometricSetup = async(email) => {
  try{
      const cookie=await getCookies();
      const response=await fetch(`${process.env.BACKEND_URL}/api/auth/user/biometric/setup`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Cookie: `backend_token=${cookie}`
        },
        body: JSON.stringify({ email: email })
      });
      const data=await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to get setup options");
      return data;
  }
  catch(err)
  {
      console.error("Biometric setup error:", err);
      throw new Error("Biometric setup failed. Please try again.");
  }
}

export const verifyBiometricRegistration=async (attestationResponse) => {
  try {
      const cookie=await getCookies();
      const res = await fetch(`${process.env.BACKEND_URL}/api/auth/user/biometric/challenge-verify`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Cookie: `backend_token=${cookie}`
        },
        body: JSON.stringify({attestationResponse})
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed on server");
      
      return data;
  } catch (err) {
      console.error("Setup verification error:", err);
      throw err;
  }
}

export const biometricVerify= async(email)=>{
  try{
      const res=await fetch(`${process.env.BACKEND_URL}/api/auth/biometric/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }) 
      });
      const options=await res.json();
      if (!res.ok) throw new Error(options.error || "Failed to get login options");
      return options;
  }
  catch(err)
  {
      console.error("Biometric verification error:", err);
      return {error:err.message || "Biometric verification failed or was cancelled."};
  }
}

export const uploadImage = async (formData) => {
  try{
    const cookie=await getCookies();
     
     const response = await fetch(`${process.env.BACKEND_URL}/api/auth/user/avatar/upload`, {
            method: "POST",
            headers: { 
              Cookie: `backend_token=${cookie}`
            },
            body: formData,
      });

      const data = await response.json();

      if(!response.ok) throw new Error(data?.error);

      return { key:data?.key};
  }
  catch(err){
    console.error(err);
    return { error: err?.message || "Failed to upload image"};
  }
}

export const saveImage = async(key)=>{
   try{
      const cookie=await getCookies();
      const response = await fetch(`${process.env.BACKEND_URL}/api/auth/user/avatar/save`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Cookie: `backend_token=${cookie}`
            },
            body: JSON.stringify({ key }),
      });

      if(!response.ok) throw new Error(response?.error)
      return {url:response?.url};
    }
    catch(err)
    {
      console.error(err);
      return { error: response?.error}
    }
}

export const startSetup = async() => {
   try
   {
        const cookie=await getCookies();
        const data=await fetch(`${process.env.BACKEND_URL}/api/auth/user/2fa/setup`,{
          method:"GET",
          headers:{
            Cookie: `backend_token=${cookie}`
          }
        });
        const res = await data.json();

        if(!data.ok)  throw new Error(res?.error)
        return { qr:res?.qr , secret:res?.secret };
   }
   catch(err)
   {
      console.log(err);
      return {error: err?.message || "Failed to setup 2FA"};
   }
}

export const handleVerify2FA = async(formData) => {
    const code = formData.get("token");
    const cookie=await getCookies(); 

    if(!code || code.length<6)
        throw new Error("Please enter a valid 6-digit code");

    try{
           const data = await fetch(`${process.env.BACKEND_URL}/api/auth/user/2fa/verify`,{
             method:"POST",
             headers:{
                "Content-type":"application/json",
                Cookie: `backend_token=${cookie}`
             },
             body:JSON.stringify({  token:code })
           })
           const response = await data.json();

           if(!data.ok) throw new Error(response?.error)
           return {recoveryCodes: response.recoveryCodes , message:response.message};
    }
    catch(err)
    {
          console.error(err);
          return { error: err?.message || "Could not connect to server"};
    }
}

export const disable2FA = async() => {
    const cookie=await getCookies();
    try
    {
           const data=await fetch(`${process.env.BACKEND_URL}/api/auth/user/2fa/disable`,{
             method:"POST",
             headers:{
              "Content-type":"application/json",
               Cookie: `backend_token=${cookie}`
            }
           })
           const response=await data.json();

           if(!data.ok) throw new Error(response?.error);
           return { message:response?.message}
    }
    catch(err)
    {
        console.log(err);
        return { error : err?.message || "Failed to disable 2FA."};
    }
}

export const sendEmail = async(email) =>{
    const cookie=await getCookies();
    try{
          const data = await fetch(`${process.env.BACKEND_URL}/api/auth/user/email/send`,{
            method:"POST",
            headers:{
              "Content-type":"application/json",
               Cookie: `backend_token=${cookie}`
            },
            body: JSON.stringify({ email })
          })

          const result = await data.json();

          if(!data.ok) throw new Error(result?.error)
          return { message: result?.message } 
    }
    catch(err)
    {
        console.log(err);
        return { error: err?.message || "Failed to send code to email."}
    }
  
}

export const verifyCode = async(formData,email) => {
  const cookie=await getCookies();
  const code = formData.get('code');
  console.log("Email and code:",email," : ",code);
  try{
        const data = await fetch(`${process.env.BACKEND_URL}/api/auth/user/email/verify`,{
            method:"POST",
            headers:{
              "Content-type":"application/json",
               Cookie: `backend_token=${cookie}`
            },
            body: JSON.stringify({ email ,code})
          })
           const result=await data.json();

           if(!data.ok) throw new Error(result?.error)
           return { message: result?.message } 
    }   
    catch(err)
    {
        console.log(err);
        return { error: err?.message || "Verification Failed."}
    }
}

export const passwordLink = async(formData) => {
    const email = formData.get("email");
    const cookie=await getCookies();
    try
    {
        const data = await fetch(`${process.env.BACKEND_URL}/api/auth/password/link`,{
            method:"POST",
            headers:{
              "Content-type":"application/json",
               Cookie: `backend_token=${cookie}`
            },
            body: JSON.stringify({ email })
        })
       const result=await data.json();

       if(!data.ok) throw new Error(result?.error);
       return { message: result?.message };
     }
     catch(err)
     {
        console.log(err);
        return { error: err?.message || "Failed to send password reset link."}
     } 
}

export const handleResetPassword = async(formData) => {
    const newPass = formData.get("password");
    const confPass = formData.get("confirmpassword");
    const token = formData.get("token");
    const userId = formData.get("id");
    const cookie=await getCookies();

    if(newPass!==confPass) throw new Error("Passwords don't match");

    try
    {
        const data = await fetch(`${process.env.BACKEND_URL}/api/auth/password/reset`,{
            method:"POST",
            headers:{
              "Content-type":"application/json",
               Cookie: `backend_token=${cookie}`
            },
            body: JSON.stringify({ 
               userId,
               token,
               newPassword: newPass
             })
        })
       const result=await data.json();

       if(!data.ok) throw new Error(result?.error)
       return { message: result?.message }
    }
    catch(err)
    {
        console.log(err);
        return { error: err?.message || "Failed to send password reset link."}
    }
}
