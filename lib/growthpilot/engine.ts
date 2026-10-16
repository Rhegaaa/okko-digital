import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { articleSchema, quality, plain, SOURCES, frenchDay, publicationDay, weekStart, type GrowthContent } from './content';
import { SEEDS, LINK_SEEDS } from './seeds';
import { fetchPublic, htmlText, backlinkIn } from './network';
import { SEO_PAGES } from '@/lib/seo-pages-data';
import { dailyResearch } from './research';
export async function ensureGrowth(){
  await prisma.growthState.upsert({where:{id:'okko'},update:{},create:{id:'okko'}});
  for(const [topic,keyword,cluster,angle,commercialPath] of SEEDS)await prisma.growthOpportunity.upsert({where:{topic},update:{},create:{topic,keyword,cluster,angle,commercialPath}});
  for(const entry of LINK_SEEDS)await prisma.growthBacklink.upsert({where:{url:entry.url},update:{},create:entry});
}
export async function logRun(id:string,message:string){const run=await prisma.growthRun.findUnique({where:{id}});const logs=Array.isArray(run?.logs)?run.logs:[];await prisma.growthRun.update({where:{id},data:{logs:[...logs,{at:new Date().toISOString(),message:message.slice(0,600)}].slice(-50)}});}
export async function existingTexts(){
  const articles=await prisma.growthArticle.findMany({where:{status:{in:['PUBLISHED','VERIFYING']}},select:{title:true,body:true}});
  return [...SEO_PAGES.map(p=>({title:p.title,text:[p.intro,...p.sections.flatMap(s=>s.paragraphs)].join(' ')})),...articles.flatMap(a=>{const parsed=articleSchema.safeParse(a.body);return parsed.success?[{title:a.title,text:plain(parsed.data)}]:[];})];
}
export async function startRun(owner:string,date=new Date()){
  await ensureGrowth();const state=await prisma.growthState.findUniqueOrThrow({where:{id:'okko'}});if(!state.enabled)return {status:'PAUSED'};
  const id=frenchDay(date);await prisma.growthRun.upsert({where:{id},update:{},create:{id}});
  const run=await prisma.growthRun.findUniqueOrThrow({where:{id}});if(run.status==='COMPLETE')return {status:'DONE'};if(run.attempts>=3)return {status:'ATTEMPTS_EXHAUSTED'};
  const leased=await prisma.growthState.updateMany({where:{id:'okko',enabled:true,OR:[{leaseUntil:null},{leaseUntil:{lt:new Date()}},{leaseOwner:owner}]},data:{leaseOwner:owner,leaseUntil:new Date(Date.now()+25*60_000),lastHeartbeat:new Date()}});if(!leased.count)return {status:'BUSY'};
  await prisma.growthRun.update({where:{id},data:{status:'RUNNING',attempts:{increment:1},finishedAt:null}});
  await logRun(id,'Début du cycle : collecte de sources, contrôles et éventuelle publication.');
  for(const message of await dailyResearch())await logRun(id,message);
  const resume=run.articleId?await prisma.growthArticle.findUnique({where:{id:run.articleId}}):null;
  const thisWeek=await prisma.growthArticle.count({where:{publishedAt:{gte:weekStart(date)},status:{in:['PUBLISHED','VERIFYING']}}});
  const opportunity=!resume&&publicationDay(date)&&thisWeek<3?await prisma.growthOpportunity.findFirst({where:{status:'NEW'},orderBy:[{priority:'desc'},{createdAt:'asc'}]}):null;
  const sources=await Promise.all(SOURCES.map(async source=>{try{const page=await fetchPublic(source.url);if(page.status!==200)return null;const text=htmlText(page.text);if(text.length<500||/unusual traffic|captcha/i.test(text.slice(0,300)))return null;return {...source,checkedAt:new Date().toISOString(),sample:text.slice(0,4000)};}catch{return null;}}));
  const verified=sources.filter((s):s is NonNullable<typeof s>=>!!s);
  await logRun(id,`${verified.length} sources officielles accessibles. Concurrence et volumes inconnus sans mesure de recherche.`);
  const backlinks=await prisma.growthBacklink.findMany({take:5,orderBy:{checkedAt:'asc'}});
  const serp=await prisma.growthSnapshot.findUnique({where:{id:'serp'}});
  return {status:'READY',id,opportunity,sources:verified,existingTitles:(await existingTexts()).map(p=>p.title),serp:serp?.payload,backlinks,resumeArticle:resume?.status==='VERIFYING'?resume.id:null,modelRequired:!!opportunity&&verified.length>=2,blockedReason:opportunity&&verified.length<2?'Sources officielles insuffisantes : aucune rédaction autorisée.':null};
}
export async function assertLease(owner:string){const state=await prisma.growthState.findUnique({where:{id:'okko'}});if(!state?.enabled||state.leaseOwner!==owner||!state.leaseUntil||state.leaseUntil<new Date())throw Error('Automatisation arrêtée ou session expirée.');}
export async function saveGenerated(owner:string,id:string,opportunityId:string,raw:unknown,critic:unknown,usage:{input:number;output:number}){
  await assertLease(owner);const opportunity=await prisma.growthOpportunity.findUniqueOrThrow({where:{id:opportunityId}});const run=await prisma.growthRun.findUniqueOrThrow({where:{id}});if(run.status!=='RUNNING')throw Error('Cycle non actif.');
  await prisma.growthRun.update({where:{id},data:{inputTokens:Math.max(0,Math.min(100000,usage.input||0)),outputTokens:Math.max(0,Math.min(30000,usage.output||0))}});
  const report=quality(raw,await existingTexts());const parsed=articleSchema.safeParse(raw);const review=(critic&&typeof critic==='object'?critic:{}) as {approved?:boolean;unsupportedClaims?:unknown[];reason?:string};if(review.approved!==true||!Array.isArray(review.unsupportedClaims)||review.unsupportedClaims.length||typeof review.reason!=='string'||!review.reason.trim())report.issues.push('La revue indépendante n’a pas validé toutes les affirmations.');
  report.ok=report.issues.length===0;
  if(!parsed.success){await logRun(id,'Contenu rejeté : '+report.issues.join(' '));await prisma.growthArticle.upsert({where:{opportunityId},update:{body:{raw:JSON.parse(JSON.stringify(raw||{}))},status:'REJECTED',checks:report},create:{opportunityId,slug:opportunity.topic,title:opportunity.keyword,description:opportunity.angle,body:{raw:JSON.parse(JSON.stringify(raw||{}))},sources:[],status:'REJECTED',checks:report}});await prisma.growthOpportunity.update({where:{id:opportunityId},data:{status:'REJECTED'}});return {published:false,checks:report};}
  if(SEO_PAGES.some(p=>p.path===`/guides/${parsed.data.slug}`)){report.ok=false;report.issues.push('Cette URL appartient déjà à un guide existant.');}
  const content=parsed.data;const sources=SOURCES.filter(s=>content.sections.some(section=>section.sourceIds.includes(s.id)));
  const suggested=(raw as {futureTopics?:unknown[]}).futureTopics;
  if(Array.isArray(suggested)&&await prisma.growthOpportunity.count({where:{status:'NEW'}})<10){
    for(const value of suggested.slice(0,3)){
      if(!value||typeof value!=='object')continue;const idea=value as {keyword?:unknown;angle?:unknown};const keyword=String(idea.keyword||'').trim().slice(0,150),angle=String(idea.angle||'').trim().slice(0,500);
      if(keyword.length<20||angle.length<40||!/google|fiche|avis/i.test(keyword)||/plomb|ma[çc]on|couvreur|b[aâ]timent|[àa] (Paris|Lyon|Marseille)/i.test(keyword+angle))continue;
      const topic=keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);
      await prisma.growthOpportunity.upsert({where:{topic},update:{},create:{topic,keyword,angle,cluster:opportunity.cluster,commercialPath:opportunity.commercialPath,source:'MODEL_IDEA',priority:35}});
    }
  }
  // Revalide les sources au moment d’enregistrer : les affirmations du worker ne font pas autorité.
  const sourceChecks=await Promise.all(sources.map(async s=>{try{return (await fetchPublic(s.url)).status===200;}catch{return false;}}));if(sourceChecks.some(ok=>!ok)){report.ok=false;report.issues.push('Une source n’est plus accessible.');}
  const article=await prisma.$transaction(async tx=>{
    const state=await tx.growthState.findUniqueOrThrow({where:{id:'okko'}});if(!state.enabled||state.leaseOwner!==owner)throw Error('Publication arrêtée.');
    const count=await tx.growthArticle.count({where:{publishedAt:{gte:weekStart()},status:{in:['PUBLISHED','VERIFYING']}}});const canPublish=report.ok&&publicationDay()&&count<3;
    const previous=await tx.growthArticle.findUnique({where:{opportunityId}});if(previous?.publishedAt)return previous;
    if(previous)await tx.growthRevision.create({data:{articleId:previous.id,snapshot:JSON.parse(JSON.stringify(previous)),reason:'Avant nouvelle tentative'}});
    const row=await tx.growthArticle.upsert({where:{opportunityId},update:{body:content,title:content.title,description:content.description,checks:report,sources,status:canPublish?'VERIFYING':'REJECTED',publishedAt:canPublish?new Date():null},create:{opportunityId,slug:content.slug,title:content.title,description:content.description,body:content,checks:report,sources,status:canPublish?'VERIFYING':'REJECTED',publishedAt:canPublish?new Date():null}});
    await tx.growthOpportunity.update({where:{id:opportunityId},data:{status:canPublish?'PUBLISHED':'REJECTED'}});
    await tx.growthRun.update({where:{id},data:{articleId:row.id,inputTokens:Math.max(0,Math.min(100000,usage.input||0)),outputTokens:Math.max(0,Math.min(30000,usage.output||0))}});return row;
  },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  await logRun(id,article.status==='VERIFYING'?'Contenu prêt ; vérification HTTP de la page avant confirmation.':'Contenu conservé sans publication : '+report.issues.join(' '));
  return {id:article.id,url:`https://okko-digital.fr/guides/${article.slug}`,published:article.status==='VERIFYING',checks:report};
}
export async function verifyArticle(owner:string,id:string){
  await assertLease(owner);const a=await prisma.growthArticle.findUniqueOrThrow({where:{id}});if(a.status!=='VERIFYING')return {ok:a.status==='PUBLISHED'};
  const page=await fetchPublic(`https://okko-digital.fr/guides/${a.slug}`);const ok=page.status===200&&htmlText(page.text).includes(a.title)&&page.text.includes('application/ld+json')&&!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(page.text);
  await prisma.growthArticle.update({where:{id},data:{status:ok?'PUBLISHED':'HELD',verifiedAt:ok?new Date():null}});return {ok};
}
export async function checkBacklink(owner:string,id:string){await assertLease(owner);const row=await prisma.growthBacklink.findUniqueOrThrow({where:{id}});try{const page=await fetchPublic(row.url);const found=page.status===200?backlinkIn(page.text,page.url):null;await prisma.growthBacklink.update({where:{id},data:{status:found?'VERIFIED':row.verifiedAt?'LOST':'OPPORTUNITY',checkedAt:new Date(),verifiedAt:found?new Date():null,target:found?.target||null,rel:found?.rel||null,evidence:found?.evidence||`HTTP ${page.status} : aucun lien HTML vers OKKO vérifié.`}});return {verified:!!found};}catch{await prisma.growthBacklink.update({where:{id},data:{status:'CHECK_FAILED',checkedAt:new Date(),evidence:'Vérification réseau impossible ; aucun lien acquis déclaré.'}});return {verified:false};}}
export async function finishRun(owner:string,id:string,error?:string){await assertLease(owner);await logRun(id,error?'Échec : '+error:'Cycle terminé.');await prisma.growthRun.update({where:{id},data:{status:error?'FAILED':'COMPLETE',finishedAt:new Date()}});await prisma.growthState.updateMany({where:{id:'okko',leaseOwner:owner},data:{leaseOwner:null,leaseUntil:null,lastHeartbeat:new Date()}});}
