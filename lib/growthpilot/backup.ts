import { createCipheriv,createHash,randomBytes } from 'node:crypto';
import { prisma } from '@/lib/db';
export async function encryptedBackup(){
  const state=await prisma.growthState.findUnique({where:{id:'okko'}});if(!state?.enabled)return {paused:true};
  const [articles,opportunities,revisions,backlinks,runs]=await Promise.all([prisma.growthArticle.findMany(),prisma.growthOpportunity.findMany(),prisma.growthRevision.findMany(),prisma.growthBacklink.findMany(),prisma.growthRun.findMany({orderBy:{startedAt:'desc'},take:60})]);
  const text=JSON.stringify({version:1,exportedAt:new Date().toISOString(),articles,opportunities,revisions,backlinks,runs});if(Buffer.byteLength(text)>5_000_000)throw Error('Sauvegarde trop volumineuse : export privé nécessaire.');
  if(!process.env.AUTH_SECRET)throw Error('Clé de sauvegarde absente.');const key=createHash('sha256').update(process.env.AUTH_SECRET).digest(),iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);const ciphertext=Buffer.concat([cipher.update(text,'utf8'),cipher.final()]);
  return {version:1,algorithm:'aes-256-gcm',exportedAt:new Date().toISOString(),iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),ciphertext:ciphertext.toString('base64')};
}
