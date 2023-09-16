import NextAuth from 'next-auth/next';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prismadb';
import { DefaultJWT, JWT } from 'next-auth/jwt';

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // make sure that the user submitted an email and a password
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // check to see if user exists in database using email submitted
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // make sure that the user has a hashedPassword
        if (!user || !user.hashedPassword) {
          return null;
        }

        // make sure passwords match after decryption
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // if they dont return
        if (!passwordsMatch) {
          return null;
        }

        // return user if everything is correct
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        return {
          ...token,
          createdAt: user.createdAt,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          createdAt: token.createdAt,
          id: token.id,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
