import { auth } from '@/auth';
import Dashboard from '@/components/Dashboard'
import React from 'react'

const DashboardPage=async() => {
  const session=await auth();
  return (
    <Dashboard session={session}/>
  )
}

export default DashboardPage