import { auth } from '@/auth';
import EmailVerification from '@/components/auth/EmailVerification'

const VerifyEmailPage = async () => {
  const session = await auth();
  return (
    <EmailVerification  session={session}/>
  )
}

export default VerifyEmailPage