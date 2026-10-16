import fs from 'node:fs';
import { prisma } from '../lib/db';
import { articleSchema } from '../lib/growthpilot/content';
async function main(){
  const file=process.argv[2];if(!file)throw Error('Usage: tsx --env-file=.env.local scripts/growth-restore.ts backup.json [--apply]');
  if(fs.statSync(file).size>20_000_000)throw Error('Sauvegarde trop volumineuse.');const data=JSON.parse(fs.readFileSync(file,'utf8'));
  if(data.version!==1||!Array.isArray(data.articles)||!Array.isArray(data.opportunities))throw Error('Format de sauvegarde invalide.');
  console.log(`${data.opportunities.length} sujets, ${data.articles.length} contenus. Restauration en brouillon, automatisation suspendue.`);if(!process.argv.includes('--apply')){console.log('Simulation uniquement. Ajouter --apply pour restaurer.');return;}
  await prisma.$transaction(async tx=>{
    await tx.growthState.upsert({where:{id:'okko'},update:{enabled:false,leaseOwner:null,leaseUntil:null},create:{id:'okko',enabled:false}});
    for(const o of data.opportunities){const fields={topic:String(o.topic),keyword:String(o.keyword),cluster:String(o.cluster),angle:String(o.angle),commercialPath:['/audit-fiche-google','/gestion-fiche-google','/gestion-avis-google','/optimisation-fiche-google','/carte-nfc-avis-google'].includes(o.commercialPath)?o.commercialPath:'/audit-fiche-google',status:'NEW'};await tx.growthOpportunity.upsert({where:{id:o.id},update:fields,create:{id:o.id,...fields}});}
    for(const a of data.articles){const parsed=articleSchema.safeParse(a.body);const fields={opportunityId:String(a.opportunityId),slug:String(a.slug),title:String(a.title),description:String(a.description),body:parsed.success?parsed.data:{raw:a.body},sources:Array.isArray(a.sources)?a.sources:[],checks:{issues:['Contenu restauré : nouvelle validation requise.']},status:'DRAFT',publishedAt:null,verifiedAt:null};await tx.growthArticle.upsert({where:{id:a.id},update:fields,create:{id:a.id,...fields}});}
  },{timeout:30000});console.log('Restauration terminée. Aucun article remis en ligne sans contrôle.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>prisma.$disconnect());
