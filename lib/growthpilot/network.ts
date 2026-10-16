import https from 'node:https';
import { resolve4 } from 'node:dns/promises';
import { BlockList, isIP } from 'node:net';
const blocked=new BlockList();
for(const [ip,prefix] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.168.0.0',16],['192.0.0.0',24],['198.18.0.0',15],['224.0.0.0',4],['240.0.0.0',4]] as const)blocked.addSubnet(ip,prefix,'ipv4');
export function publicUrl(value:string){const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||(u.port&&u.port!=='443')||isIP(u.hostname)||!u.hostname.includes('.')||u.hostname.endsWith('.local'))throw Error('URL publique HTTPS requise.');return u;}
export async function fetchPublic(value:string,redirects=0):Promise<{url:string;status:number;text:string}> {
  const u=publicUrl(value);const addresses=await resolve4(u.hostname);if(!addresses.length||addresses.some(ip=>blocked.check(ip,'ipv4')))throw Error('Adresse privée ou réservée interdite.');
  const sizeLimit=u.hostname==='support.google.com'?8_000_000:1_500_000;
  const result=await new Promise<{status:number;location?:string;text:string}>((resolve,reject)=>{
    const req=https.get(u,{headers:{'User-Agent':'OKKO-GrowthPilot/1.0 (+https://okko-digital.fr/contact)','Accept':'text/html,application/xml,text/plain'},lookup:(_hostname,options,callback)=>{const cb=callback as unknown as (error:Error|null,address:unknown,family?:number)=>void;if(typeof options==='object'&&options.all)cb(null,addresses.map(address=>({address,family:4})));else cb(null,addresses[0],4);}},res=>{
      const chunks:Buffer[]=[];let size=0;res.on('data',(chunk:Buffer)=>{size+=chunk.length;if(size>sizeLimit){req.destroy(Error('Page trop volumineuse.'));return;}chunks.push(chunk);});res.on('end',()=>resolve({status:res.statusCode||0,location:res.headers.location,text:Buffer.concat(chunks).toString('utf8')}));res.on('error',reject);
    });req.setTimeout(10000,()=>req.destroy(Error('Délai réseau dépassé.')));req.on('error',reject);
  });
  if([301,302,303,307,308].includes(result.status)&&result.location){if(redirects>=3)throw Error('Trop de redirections.');return fetchPublic(new URL(result.location,u).href,redirects+1);}
  return {url:u.href,status:result.status,text:result.text};
}
export function htmlText(html:string){return html.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&#x27;|&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();}
export function backlinkIn(html:string,base:string){
  for(const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){
    const href=match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];if(!href)continue;
    try{const u=new URL(href.replace(/&amp;/g,'&'),base);if(u.protocol==='https:'&&(u.hostname==='okko-digital.fr'||u.hostname==='www.okko-digital.fr'))return {target:u.href,rel:match[1].match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1]||'',evidence:htmlText(match[2]).slice(0,200)||'Lien sans ancre textuelle'};}catch{}
  }return null;
}
