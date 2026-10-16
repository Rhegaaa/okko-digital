import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { cleanPath,limitPublic,sameOrigin } from '@/lib/growthpilot/metrics';
import { frenchDay } from '@/lib/growthpilot/content';
const schema=z.object({name:z.string().trim().min(2).max(120),company:z.string().trim().min(1).max(160),email:z.string().trim().email().max(200),profile:z.string().trim().min(5).max(1500),message:z.string().trim().max(3000).default(''),submissionKey:z.string().uuid(),sourcePath:z.string().max(200),startedAt:z.number()});
export async function POST(req:Request){
  if(!sameOrigin(req))return NextResponse.json({error:'Origine non autorisée.'},{status:403});
  if(Number(req.headers.get('content-length')||0)>12000)return NextResponse.json({error:'Demande trop volumineuse.'},{status:413});
  const body=await req.json().catch(()=>null);if(body?.website_check)return NextResponse.json({ok:true});const input=schema.safeParse(body);
  if(!input.success)return NextResponse.json({error:'Vérifiez votre nom, votre établissement, votre email et le lien de votre fiche.'},{status:400});
  const v=input.data;if(Date.now()-v.startedAt<1500||Date.now()-v.startedAt>86400000)return NextResponse.json({error:'Veuillez patienter un instant ou recharger le formulaire.'},{status:400});
  if(!(await limitPublic(req,'contact',5)))return NextResponse.json({error:'Trop de demandes. Réessayez plus tard ou contactez-nous par email.'},{status:429});
  const key='lead:'+v.submissionKey;const previous=await prisma.growthSnapshot.findUnique({where:{id:key}});if(previous)return NextResponse.json({ok:true});
  try{await prisma.$transaction(async tx=>{
    await tx.growthSnapshot.create({data:{id:key,source:'FORM_RECEIPT',payload:{receivedAt:new Date().toISOString()}}});
    const message=`Fiche Google : ${v.profile}\nPage d’origine : ${cleanPath(v.sourcePath)}\n\n${v.message}`;
    const prospect=await tx.prospect.create({data:{company:v.company,contactName:v.name,email:v.email,source:'Formulaire site',service:'PRESENCE_LOCALE',notes:message,status:'NOUVEAU'}});
    await tx.contactSubmission.create({data:{projectType:'PRESENCE_LOCALE',name:v.name,company:v.company,email:v.email,message,prospectId:prospect.id}});
    await tx.notification.create({data:{type:'contact',title:'Nouvelle demande de devis',message:v.company,link:`/control/prospects?focus=${prospect.id}`}});
    const day=frenchDay(),path=cleanPath(v.sourcePath),event='LEAD';await tx.growthMetric.upsert({where:{day_path_event:{day,path,event}},update:{count:{increment:1}},create:{day,path,event,count:1}});
  });return NextResponse.json({ok:true});}catch(e){if((e as {code?:string}).code==='P2002')return NextResponse.json({ok:true});console.error('Contact storage failed');return NextResponse.json({error:'Votre demande n’a pas pu être enregistrée. Réessayez ou écrivez à contact@okko-digital.fr.'},{status:500});}
}
