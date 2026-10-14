import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ success: false, message: 'Les inscriptions publiques sont fermées. Cet espace est privé.' }, { status: 403 });
}
