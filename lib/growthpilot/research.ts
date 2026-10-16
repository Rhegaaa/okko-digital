import { prisma } from '@/lib/db';
import { fetchPublic,htmlText,publicUrl } from './network';
import { normalize } from './content';
import { syncGsc } from './gsc';
export async function dailyResearch(){
  const log:string[]=[];
  await prisma.authAttempt.deleteMany({where:{key:{startsWith:'growth:'},windowStarted:{lt:new Date(Date.now()-2*86400000)}}});
  await prisma.growthSnapshot.deleteMany({where:{id:{startsWith:'lead:'},updatedAt:{lt:new Date(Date.now()-2*86400000)}}});
  try{const gsc=await syncGsc();log.push(gsc.connected?'Search Console synchronisée sur le domaine principal uniquement.':gsc.note||'GSC non configurée.');
    if(gsc.connected)for(const row of (gsc.rows||[]).slice(0,30)){
      const query=String(row.keys?.[0]||'');const topic=normalize(query).replace(/ /g,'-').slice(0,90);
      if(topic.length<15||!/(fiche|avis|google business|google my business)/i.test(query)||/(plomb|ma[çc]on|couvreur|b[aâ]timent)/i.test(query))continue;
      await prisma.growthOpportunity.upsert({where:{topic},update:{evidence:row},create:{topic,keyword:query,cluster:'Recherche mesurée',angle:`Répondre à cette recherche réelle avec une procédure fondée sur les sources Google ; vérifier le chevauchement avec ${row.keys?.[1]||'les pages existantes'}.`,commercialPath:'/audit-fiche-google',source:'GSC',evidence:row,priority:Math.min(90,50+Math.round(row.impressions||0))}});
    }
  }catch{log.push('Search Console indisponible ; aucune statistique créée.');}
  const candidate=await prisma.growthOpportunity.findFirst({where:{status:'NEW'},orderBy:{priority:'desc'}});
  if(candidate){
    try{const page=await fetchPublic('https://www.google.com/search?hl=fr&num=5&q='+encodeURIComponent(candidate.keyword));const accessible=page.status===200&&!/unusual traffic|captcha|enable javascript/i.test(htmlText(page.text).slice(0,1000));
      const results:{url:string;title:string}[]=[];
      if(accessible)for(const a of page.text.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)){
        try{const href=a[1].replace(/&amp;/g,'&');const u=href.startsWith('/url?')?new URL(href,'https://www.google.com').searchParams.get('q'):href;if(!u)continue;const url=publicUrl(u);if(/(^|\.)google\.[a-z.]+$|youtube\.com$/.test(url.hostname)||url.hostname==='okko-digital.fr')continue;const title=htmlText(a[2]).slice(0,180);if(title.length<12||results.some(r=>r.url===url.href))continue;results.push({url:url.href,title});if(results.length>=5)break;}catch{}
      }
      await prisma.growthSnapshot.upsert({where:{id:'serp'},update:{source:'GOOGLE_HTML',payload:{query:candidate.keyword,measuredAt:new Date().toISOString(),accessible:accessible&&results.length>0,results,competition:'UNKNOWN'}},create:{id:'serp',source:'GOOGLE_HTML',payload:{query:candidate.keyword,accessible:accessible&&results.length>0,results,competition:'UNKNOWN'}}});
      log.push(results.length?`${results.length} résultats Google observés, sans score de concurrence inventé.`:'Résultats Google non exploitables ; aucun contournement ni faux classement.');
    }catch{log.push('Recherche Google indisponible ; les hypothèses éditoriales restent distinctes des mesures.');}
  }
  return log;
}
