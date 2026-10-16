import { createHmac } from 'node:crypto';
import { prisma } from '@/lib/db';
import { frenchDay } from './content';
export function sameOrigin(req:Request){try{const origin=new URL(req.headers.get('origin')||'');return ['http:','https:'].includes(origin.protocol)&&origin.host===(req.headers.get('host')||new URL(req.url).host);}catch{return false;}}
export function cleanPath(path:unknown){const p=String(path||'/contact').split(/[?#]/)[0];return /^\/(?:guides\/[a-z0-9-]+|[a-z0-9-]*)$/.test(p)&&p.length<160?p:'/contact';}
export async function limitPublic(req:Request,kind:string,max:number){
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';const key='growth:'+kind+':'+createHmac('sha256',process.env.AUTH_SECRET||'local').update(ip+frenchDay()).digest('hex');const since=new Date(Date.now()-15*60_000);
  await prisma.authAttempt.upsert({where:{key},update:{},create:{key}});await prisma.authAttempt.updateMany({where:{key,windowStarted:{lt:since}},data:{failures:0,windowStarted:new Date()}});
  const update=await prisma.authAttempt.updateMany({where:{key,failures:{lt:max}},data:{failures:{increment:1}}});return !!update.count;
}
export async function recordMetric(event:'CTA'|'LEAD',path:string){const day=frenchDay();await prisma.growthMetric.upsert({where:{day_path_event:{day,path,event}},update:{count:{increment:1}},create:{day,path,event,count:1}});}
