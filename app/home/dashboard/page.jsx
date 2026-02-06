import { auth } from "@/auth";
import Dashboard from "@/components/Dashboard";

const DashboardPage = async () => {
   const session = await auth(); 
  return <Dashboard session={session}/>;
};

export default DashboardPage;
