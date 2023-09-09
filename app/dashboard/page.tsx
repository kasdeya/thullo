'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  return <>Dashboard Page</>;
};

export default DashboardPage;
