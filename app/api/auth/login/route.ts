import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ success: false, message: 'Utilisez la connexion sécurisée OKKO Control.' }, { status: 410 });
}
