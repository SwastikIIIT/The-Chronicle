import { auth } from "@/auth";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { SplashCursor } from "@/components/ui/splash-cursor";


export default async function Home() {
   
  const sessionUser=await auth();
  console.log("Session:",sessionUser);
   
  return (
    <div className="min-h-screen bg-black">
       <SplashCursor/>
       <BackgroundPaths  title="The Chronicle"></BackgroundPaths>
    </div>
   );
}


    /* <Hero
      title="Welcome to My Website"
      subtitle="This is an authentication and authorisation system built by me"
      actions={[
        { label: "Get Started", href: "/start", variant: "primary",type:"starBorder" },
        { label: sessionUser?.user ? "Sign Out" : "Login", href: "/login" },
      ]}
    /> 
       {/* {(sessionUser?.user)? 
       (<SignoutButton/>)
       :(<> <Link href="/login"><Button className="cursor-pointer">Log In</Button></Link></>)} */
