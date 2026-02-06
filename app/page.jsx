import { BackgroundPaths } from "@/components/ui/background-paths";
import { SplashCursor } from "@/components/ui/splash-cursor";

export default async function Home() {
   
  return (
    <div className="min-h-screen bg-black">
       <SplashCursor/>
       <BackgroundPaths  title="The Chronicle"></BackgroundPaths>
    </div>
   );
}
