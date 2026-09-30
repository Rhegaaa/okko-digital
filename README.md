# OKKO Digital

Site + back-office (`/control`) — Next.js, Prisma/PostgreSQL, Stripe, Resend, NextAuth.

## Mise en ligne (Vercel)
1. Créer une base PostgreSQL (Vercel > Storage > Neon ou Supabase) et copier son URL dans `DATABASE_URL`.
2. Saisir les variables de `.env.example` dans Vercel > Settings > Environment Variables.
3. Créer les tables : `npx prisma db push` (avec `DATABASE_URL` en variable d'environnement locale).
4. Créer le premier compte admin : `POST /api/signup` (autorisé uniquement tant qu'aucun compte n'existe).
5. Stripe : recréer le webhook vers `https://okko-digital.fr/api/webhooks/stripe`.
6. Google : ajouter `https://okko-digital.fr/api/auth/callback/google` aux URI de redirection autorisées.
