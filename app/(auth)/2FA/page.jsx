import { auth } from "@/auth";
import TwoFactorComponent from "@/components/auth/TwoFactor";

const TwoFactorPage = async () => {
  const session = await auth();
  return <TwoFactorComponent session={session}/>;
};

export default TwoFactorPage;