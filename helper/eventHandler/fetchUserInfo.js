'use server'
import { cookies } from "next/headers";

const fetchUserInfo = async () => {
  try {
    const Cookies= await cookies();
    const cookie = Cookies.get("backend_token")?.value;

    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/user`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           Cookie: `backend_token=${cookie}`,
        },
      }
    );

    const data = await response.json();
   
    if (!response.ok) return { success: false, message: data.message };

    return {
      success: true,
      userData: data.user,
      auditTrail: data.loginHistory,
      message: data.message,
    };
  } 
  catch (err) {
    console.error(err);
    return { success: false, message: err.message || "Could not load user info"};
  }
};

export default fetchUserInfo;