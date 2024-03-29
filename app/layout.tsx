import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import SessionProvider from '../components/SessionProvider';
import { ModalProvider } from '@/components/providers/modal-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Thullo - Jesus Venegas',
  description: 'devchallenges.io - jesusvenegas.com',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={inter.className}
        suppressHydrationWarning>
        <SessionProvider session={session}>
          <ModalProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light">
              {children}
            </ThemeProvider>
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
