import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workerIdentity } from '@/lib/growthpilot/auth';
import { startRun,saveGenerated,verifyArticle,checkBacklink,finishRun,assertLease } from '@/lib/growthpilot/engine';
export const maxDuration=60;
const body=z.object({op:z.enum(['start','content','verify','backlink','finish']),id:z.string().max(100).optional(),opportunityId:z.string().max(100).optional(),content:z.unknown().optional(),critic:z.unknown().optional(),usage:z.object({input:z.number().int().min(0).max(100000),output:z.number().int().min(0).max(30000)}).optional(),error:z.string().max(1000).optional()});
export async function POST(req:Request){
  let owner:string;try{owner=await workerIdentity(req);}catch{return NextResponse.json({error:'Non autorisé'},{status:401});}
  if(Number(req.headers.get('content-length')||0)>100000)return NextResponse.json({error:'Requête trop volumineuse'},{status:413});
  const parsed=body.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Requête invalide'},{status:400});
  const v=parsed.data;try{
    if(v.op==='start')return NextResponse.json(await startRun(owner));await assertLease(owner);
    if(!v.id)throw Error('Identifiant requis.');
    if(v.op==='content'){if(!v.opportunityId)throw Error('Sujet requis.');return NextResponse.json(await saveGenerated(owner,v.id,v.opportunityId,v.content,v.critic,v.usage||{input:0,output:0}));}
    if(v.op==='verify')return NextResponse.json(await verifyArticle(owner,v.id));
    if(v.op==='backlink')return NextResponse.json(await checkBacklink(owner,v.id));
    await finishRun(owner,v.id,v.error);return NextResponse.json({ok:true});
  }catch(e){console.error('GrowthPilot worker failed',e instanceof Error?e.message:'Unknown error');return NextResponse.json({error:e instanceof Error?e.message:'Échec du cycle'},{status:409});}
}
