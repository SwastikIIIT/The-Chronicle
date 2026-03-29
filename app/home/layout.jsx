import { auth } from '@/auth';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import React from 'react'

const AuthBackendLayout = async ({ children }) => {
  const session = await auth();
  return (
    <>
      <div className='min-h-screen' style={{ background: '#070707' }}>
        <Navbar session={session} />
        {children}
      </div>
      <Footer />
    </>
  )
}

export default AuthBackendLayout;