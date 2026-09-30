import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Création de compte administrateur.
 * Le back-office est privé : la création est autorisée uniquement si aucun compte n'existe
 * ou si ALLOW_SIGNUP=true est défini dans la configuration.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');
    const name = body?.name ? String(body.name) : null;

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Adresse email invalide.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, message: 'Le mot de passe doit contenir au moins 8 caractères.' }, { status: 400 });
    }

    const count = await prisma.user.count();
    const allowed = count === 0 || process.env.ALLOW_SIGNUP === 'true';
    if (!allowed) {
      return NextResponse.json({ success: false, message: 'Les inscriptions sont fermées. Cet espace est réservé.' }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Un compte existe déjà avec cet email.' }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash, name, role: 'admin' } });
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error('signup error', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
