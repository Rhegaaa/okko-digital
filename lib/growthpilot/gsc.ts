import { createSign } from 'node:crypto';
import { prisma } from '@/lib/db';
export async function syncGsc(){
  if(!process.env.GROWTH_GSC_CREDENTIALS)return {connected:false,note:'GSC Wizard est utilisable dans Codex ; la connexion cloud autonome n’est pas configurée.'};
  const credentials=JSON.parse(process.env.GROWTH_GSC_CREDENTIALS) as {client_email:string;private_key:string};
  const enc=(v:unknown)=>Buffer.from(JSON.stringify(v)).toString('base64url');const now=Math.floor(Date.now()/1000);
  const unsigned=enc({alg:'RS256',typ:'JWT'})+'.'+enc({iss:credentials.client_email,scope:'https://www.googleapis.com/auth/webmasters.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
  const sign=createSign('RSA-SHA256');sign.update(unsigned);const assertion=unsigned+'.'+sign.sign(credentials.private_key,'base64url');
  const tokenResponse=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(10000)});if(!tokenResponse.ok)throw Error('Connexion Search Console refusée.');const token=await tokenResponse.json();
  const end=new Date(Date.now()-3*86400000),start=new Date(end.getTime()-27*86400000);const range={startDate:start.toISOString().slice(0,10),endDate:end.toISOString().slice(0,10)};
  const response=await fetch('https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aokko-digital.fr/searchAnalytics/query',{method:'POST',headers:{Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({...range,dimensions:['query','page'],rowLimit:100,dimensionFilterGroups:[{filters:[{dimension:'page',operator:'includingRegex',expression:'^https://(www\\.)?okko-digital\\.fr/'}]}]}),signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Lecture Search Console impossible.');const data=await response.json();
  await prisma.growthSnapshot.upsert({where:{id:'gsc'},update:{source:'GOOGLE_API',payload:{range,...data}},create:{id:'gsc',source:'GOOGLE_API',payload:{range,...data}}});
  return {connected:true,rows:data.rows||[],range};
}
