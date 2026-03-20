import { auth } from "@/auth";
import Settings from "@/components/Settings";

const SettingsPage = async () => {
  const session = await auth();
  return <Settings session={session}/>;
};

export default SettingsPage;