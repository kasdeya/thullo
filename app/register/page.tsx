'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RegisterPage = () => {
  const router = useRouter();
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const registerUser = async (e: any) => {
    e.preventDefault();
    await axios.post('/api/register', {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
    });

    router.push('/login');
  };

  const formatNameInput = (string: string) => {
    const formatted = string.charAt(0).toUpperCase() + string.slice(1);
    return formatted;
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-10 w-auto"
          src="/images/Logo.svg"
          width={300}
          height={300}
          alt="Thullo"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
          Register for an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={registerUser}>
          <div>
            <Label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 ">
              First Name
            </Label>
            <div className="mt-2">
              <Input
                id="firstName"
                name="firstName"
                autoCapitalize="on"
                type="text"
                autoComplete="firstName"
                value={data.firstName}
                onChange={(e) => {
                  setData({
                    ...data,
                    firstName: formatNameInput(e.target.value),
                  });
                }}
                required
                className="w-full rounded-md py-1.5"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 ">
              Last Name
            </Label>
            <div className="mt-2">
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoCapitalize="on"
                autoComplete="lastName"
                value={data.lastName}
                onChange={(e) => {
                  setData({ ...data, lastName: e.target.value });
                }}
                required
                className="w-full rounded-md py-1.5"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="username"
              className="block text-sm font-medium leading-6 ">
              Username
            </Label>
            <div className="mt-2">
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={data.username}
                onChange={(e) => {
                  setData({ ...data, username: e.target.value });
                }}
                required
                className="w-full rounded-md py-1.5"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium leading-6 ">
              Email address
            </Label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                }}
                required
                className="w-full rounded-md py-1.5"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="block text-sm font-medium leading-6 ">
                Password
              </Label>
              <div className="text-sm">
                <Link
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full rounded-md py-1.5"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Register
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{' '}
          <Link
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
