'use client';
import Image from 'next/image';
import { Button } from './ui/button';
import { ArrowDown, ChevronDown, MenuIcon, MenuSquare } from 'lucide-react';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Board, User } from '@prisma/client';
import { getUser } from '@/lib/get-user';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { FileUploadButton } from './UploadButton';
import { CustomUpload } from './CustomUpload';

const Header = ({ board = null }) => {
  const { setTheme, theme } = useTheme();
  const [user, setUser] = useState<User | null>();
  const { data: session, status } = useSession();

  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const userFetched = await getUser();
      setUser(userFetched);
    };
    fetchUser();
  }, [user, status]);

  const formatName = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0).toUpperCase() + firstName?.slice(1);
    const second = lastName?.charAt(0).toUpperCase() + lastName?.slice(1);
    const fullName = `${first} ${second}`;
    return fullName;
  };

  if (window.screen.width > 800) {
    return (
      <div className="h-[70px] w-full relative flex flex-row gap-2 place-items-center justify-between px-4">
        <Image
          src={'/images/Logo.svg'}
          alt="Thullo"
          fill
          sizes=""
          className="!relative !w-[100px] !h-[30px] "
        />

        {
          //@ts-ignore
          board && <p className="whitespace-nowrap">{board.title}</p>
        }

        <Button onClick={() => router.push('/boards')}>
          <MenuSquare /> All board
        </Button>
        <div className="flex flex-row">
          <Input className="max-w-[340px]" />
          <Button>Search</Button>
        </div>
        {user ? (
          <Popover>
            <PopoverTrigger className="flex flex-row place-items-center gap-5 px-5">
              <Avatar>
                <AvatarImage src={user?.profileImage as string} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0).toUpperCase()}
                  {user?.lastName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="whitespace-nowrap">
                {user?.firstName &&
                  user?.lastName &&
                  formatName(user?.firstName, user?.lastName)}
              </p>
              <ChevronDown />
            </PopoverTrigger>
            <PopoverContent>
              <CustomUpload
                endPoint="avatarImage"
                userId={user.id}
              />
              <Button
                className="w-full"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <Button
                onClick={() => signOut()}
                className="w-full"
                variant={'secondary'}>
                Log out
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => router.push('/login')}
              className=""
              variant={'secondary'}>
              Log in
            </Button>
            <Button
              onClick={() => router.push('/register')}
              className=""
              variant={'default'}>
              Register
            </Button>
          </div>
        )}
      </div>
    );
  }
  if (window.screen.width < 800) {
    return (
      <div className="flex flex-row justify-between place-items-center p-5">
        <Sheet>
          <SheetTrigger>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side={'left'}>
            <div className="h-[70px] w-full relative flex flex-col gap-2 place-items-start justify-start px-4">
              <Image
                src={'/images/Logo.svg'}
                alt="Thullo"
                fill
                sizes=""
                className="!relative !w-[100px] !h-[30px] "
              />

              {
                //@ts-ignore
                board && <p className="whitespace-nowrap">{board.title}</p>
              }

              <Button onClick={() => router.push('/boards')}>
                <MenuSquare /> All board
              </Button>
              <div className="flex flex-row">
                <Input className="max-w-[340px]" />
                <Button>Search</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {user ? (
          <Popover>
            <PopoverTrigger className="flex flex-row place-items-center gap-5 px-5">
              <Avatar>
                <AvatarImage src={user?.profileImage as string} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0).toUpperCase()}
                  {user?.lastName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="whitespace-nowrap">
                {user?.firstName &&
                  user?.lastName &&
                  formatName(user?.firstName, user?.lastName)}
              </p>
              <ChevronDown />
            </PopoverTrigger>
            <PopoverContent>
              <CustomUpload
                endPoint="avatarImage"
                userId={user.id}
              />
              <Button
                className="w-full"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <Button
                onClick={() => signOut()}
                className="w-full"
                variant={'secondary'}>
                Log out
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => router.push('/login')}
              className=""
              variant={'secondary'}>
              Log in
            </Button>
            <Button
              onClick={() => router.push('/register')}
              className=""
              variant={'default'}>
              Register
            </Button>
          </div>
        )}
      </div>
    );
  }
};

export default Header;
