import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createHmac } from 'node:crypto';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/control/connexion', error: '/control/connexion' },
  cookies: {
    state: {
      name: 'authjs.state',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' },
    },
    pkceCodeVerifier: {
      name: 'authjs.pkce.code_verifier',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' },
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Identifiants',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').trim().toLowerCase();
        const password = String(credentials?.password ?? '');
        if (!email || !password || password.length > 100 || email.length > 200) return null;
        const key = createHmac('sha256', process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '').update(email).digest('hex');
        const window = new Date(Date.now() - 15 * 60_000);
        const attempt = await prisma.authAttempt.upsert({ where: { key }, update: {}, create: { key } });
        if (attempt.windowStarted < window) await prisma.authAttempt.update({ where: { key }, data: { failures: 0, windowStarted: new Date() } });
        else if (attempt.failures >= 8) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        const ok = user?.password ? await bcrypt.compare(password, user.password) : false;
        if (!ok || !user || user.role !== 'admin') {
          await prisma.authAttempt.update({ where: { key }, data: { failures: { increment: 1 } } });
          return null;
        }
        await prisma.authAttempt.update({ where: { key }, data: { failures: 0 } });
        return { id: user.id, email: user.email, name: user.name ?? undefined, role: user.role };
      },
    }),
  ],
  callbacks: {
    // Le back-office est privé : la connexion Google n'est acceptée que pour un
    // compte administrateur déjà présent en base (email vérifié côté Google).
    async signIn({ account, profile }) {
      if (account?.provider !== 'google') return true;
      const email = String(profile?.email ?? '').trim().toLowerCase();
      const verified = (profile as { email_verified?: boolean } | null)?.email_verified === true;
      if (!email || !verified) {
        console.warn('[auth] Connexion Google refusée : email absent ou non vérifié.');
        return false;
      }
      const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
      if (!existing || existing.role !== 'admin') {
        console.warn(`[auth] Connexion Google refusée : ${email} n'est pas un compte administrateur.`);
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: string }).role ?? 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = String(token?.id ?? '');
        session.user.role = (token?.role as string | undefined) ?? 'admin';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
