import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { requireAdmin, unauthorized, badRequest, readJson } from '@/lib/admin-api';
export async function POST(req:Request){
  const session=await requireAdmin();if(!session)return unauthorized();const body=await readJson(req);const current=String(body.currentPassword||'');const next=String(body.newPassword||'');
  if(next.length<12||next.length>100)return badRequest('Le nouveau mot de passe doit contenir 12 à 100 caractères.');
  const user=await prisma.user.findUnique({where:{id:session.user.id}});if(!user?.password||!(await bcrypt.compare(current,user.password)))return badRequest('Mot de passe actuel incorrect.');
  await prisma.user.update({where:{id:user.id},data:{password:await bcrypt.hash(next,12)}});return NextResponse.json({ok:true});
}
