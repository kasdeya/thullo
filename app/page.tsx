'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to '/boards' when the component mounts
    router.replace('/boards');
  }, [router]);
};

export default LoginPage;
