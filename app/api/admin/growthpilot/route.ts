import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin,unauthorized,badRequest,readJson } from '@/lib/admin-api';
import { ensureGrowth } from '@/lib/growthpilot/engine';
import { publicUrl } from '@/lib/growthpilot/network';
const schema=z.discriminatedUnion('op',[
  z.object({op:z.literal('toggle'),enabled:z.boolean()}),
  z.object({op:z.literal('withdraw'),id:z.string()}),
  z.object({op:z.literal('restore'),id:z.string()}),
  z.object({op:z.literal('retry'),id:z.string()}),
  z.object({op:z.literal('backlink'),url:z.string().max(1500),label:z.string().min(3).max(200),rationale:z.string().min(10).max(2000)}),
]);
export async function POST(req:Request){
  if(!(await requireAdmin()))return unauthorized();const input=schema.safeParse(await readJson(req));if(!input.success)return badRequest('Action invalide.');await ensureGrowth();const v=input.data;
  if(v.op==='toggle'){
    await prisma.$transaction(async tx=>{
      await tx.growthState.update({where:{id:'okko'},data:{enabled:v.enabled,...(!v.enabled?{leaseOwner:null,leaseUntil:null}:{})}});
      if(!v.enabled)for(const run of await tx.growthRun.findMany({where:{status:'RUNNING'}}))await tx.growthRun.update({where:{id:run.id},data:{status:'PAUSED',finishedAt:new Date(),logs:[...(Array.isArray(run.logs)?run.logs:[]),{at:new Date().toISOString(),message:'Arrêt demandé depuis le dashboard : publication bloquée et cycle interrompu.'}]}});
    });return NextResponse.json({ok:true});
  }
  if(v.op==='backlink'){try{publicUrl(v.url);}catch{return badRequest('Lien public HTTPS requis.');}await prisma.growthBacklink.upsert({where:{url:v.url},update:{label:v.label,rationale:v.rationale},create:{url:v.url,label:v.label,rationale:v.rationale,proposal:'Préparer une proposition pertinente après lecture de la ligne éditoriale et de la procédure du site. Aucun envoi automatique.'}});return NextResponse.json({ok:true});}
  if(v.op==='retry'){await prisma.growthOpportunity.update({where:{id:v.id},data:{status:'NEW'}});return NextResponse.json({ok:true});}
  const row=await prisma.growthArticle.findUnique({where:{id:v.id},include:{revisions:{orderBy:{createdAt:'desc'},take:1}}});if(!row)return badRequest('Article introuvable.');
  if(v.op==='withdraw'){await prisma.$transaction([prisma.growthRevision.create({data:{articleId:row.id,snapshot:JSON.parse(JSON.stringify(row)),reason:'Retrait manuel'}}),prisma.growthArticle.update({where:{id:row.id},data:{status:'HELD'}})]);return NextResponse.json({ok:true});}
  const revision=row.revisions.find(r=>r.reason==='Retrait manuel');if(!revision)return badRequest('Aucune version publiée à restaurer.');const snapshot=revision.snapshot as {status?:string;body?:object};if(snapshot.status!=='PUBLISHED'&&snapshot.status!=='VERIFYING')return badRequest('La version précédente n’était pas publiée.');await prisma.growthArticle.update({where:{id:row.id},data:{status:'PUBLISHED',body:snapshot.body}});return NextResponse.json({ok:true});
}
export async function GET(){if(!(await requireAdmin()))return unauthorized();const [articles,revisions,opportunities,backlinks,runs,metrics,snapshots,state]=await Promise.all([prisma.growthArticle.findMany(),prisma.growthRevision.findMany(),prisma.growthOpportunity.findMany(),prisma.growthBacklink.findMany(),prisma.growthRun.findMany(),prisma.growthMetric.findMany(),prisma.growthSnapshot.findMany(),prisma.growthState.findUnique({where:{id:'okko'}})]);return NextResponse.json({version:1,exportedAt:new Date().toISOString(),state,articles,revisions,opportunities,backlinks,runs,metrics,snapshots},{headers:{'Content-Disposition':'attachment; filename="growthpilot-backup.json"','Cache-Control':'private, no-store'}});}
