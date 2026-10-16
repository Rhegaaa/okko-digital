import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin,unauthorized,badRequest,readJson } from '@/lib/admin-api';
import { encryptCredential } from '@/lib/growthpilot/credential';
import { geminiStatus,validateGeminiKey } from '@/lib/growthpilot/gemini';
export const maxDuration=30;
const schema=z.object({apiKey:z.string().trim().min(20).max(500).regex(/^\S+$/),freeTierConfirmed:z.literal(true)});
function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
export async function GET(){if(!(await requireAdmin()))return unauthorized();return NextResponse.json(await geminiStatus(),{headers:{'Cache-Control':'private, no-store'}});}
export async function POST(req:Request){
  if(!(await requireAdmin()))return unauthorized();if(!sameOrigin(req))return NextResponse.json({error:'Origine invalide.'},{status:403});
  if(Number(req.headers.get('content-length')||0)>2000)return badRequest('Requête trop volumineuse.');
  const input=schema.safeParse(await readJson(req));if(!input.success)return badRequest('Une clé valide et la confirmation Free Tier sont nécessaires.');
  const state=await prisma.growthState.findUnique({where:{id:'okko'}});if(state?.leaseUntil&&state.leaseUntil>new Date())return badRequest('Attendre la fin du cycle avant de changer la connexion.');
  try{await validateGeminiKey(input.data.apiKey);await prisma.growthCredential.upsert({where:{id:'gemini'},create:{id:'gemini',encryptedKey:encryptCredential(input.data.apiKey),freeTierConfirmedAt:new Date()},update:{encryptedKey:encryptCredential(input.data.apiKey),enabled:true,freeTierConfirmedAt:new Date()}});return NextResponse.json({ok:true,...await geminiStatus()},{headers:{'Cache-Control':'private, no-store'}});}catch(e){return badRequest(e instanceof Error?e.message:'Connexion impossible.');}
}
export async function DELETE(req:Request){
  if(!(await requireAdmin()))return unauthorized();if(!sameOrigin(req))return NextResponse.json({error:'Origine invalide.'},{status:403});
  await prisma.$transaction(async tx=>{
    await tx.growthCredential.updateMany({where:{id:'gemini'},data:{enabled:false}});
    await tx.growthState.updateMany({where:{id:'okko'},data:{enabled:false,leaseOwner:null,leaseUntil:null}});
    for(const run of await tx.growthRun.findMany({where:{status:'RUNNING'}}))await tx.growthRun.update({where:{id:run.id},data:{status:'PAUSED',finishedAt:new Date(),logs:[...(Array.isArray(run.logs)?run.logs:[]),{at:new Date().toISOString(),message:'Connexion Gemini désactivée : automatisation suspendue.'}]}});
  });return NextResponse.json({ok:true});
}
