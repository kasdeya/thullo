'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  console.log(session, status);
  return <>Dashboard Page</>;
};

export default DashboardPage;
