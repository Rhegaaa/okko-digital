import assert from 'node:assert/strict';
import { articleSchema,quality,publicationDay,frenchDay,weekStart } from '../lib/growthpilot/content';
import { backlinkIn,fetchPublic } from '../lib/growthpilot/network';
import { ensureGrowth,startRun } from '../lib/growthpilot/engine';
import { prisma } from '../lib/db';
import { encryptedBackup } from '../lib/growthpilot/backup';
import { createDecipheriv,createHash } from 'node:crypto';
async function main(){
  assert.equal(frenchDay(new Date('2026-10-25T23:30:00Z')),'2026-10-26');assert.equal(publicationDay(new Date('2026-10-16T08:00:00Z')),true);assert.equal(publicationDay(new Date('2026-10-17T08:00:00Z')),false);assert.equal(frenchDay(weekStart(new Date('2026-10-18T08:00:00Z'))),'2026-10-12');
  assert.equal(weekStart(new Date('2026-10-19T04:00:00Z')).toISOString(),'2026-10-18T22:00:00.000Z');
  assert.equal(weekStart(new Date('2026-10-26T05:00:00Z')).toISOString(),'2026-10-25T23:00:00.000Z');
  if(process.argv.includes('--pure')){console.log('Paris week boundaries include Monday at 06:00 in summer and winter.');return;}
  assert.equal(backlinkIn('<a href="https://okko-digital.fr.evil.test/">faux</a>','https://example.org'),null);assert.equal(backlinkIn('<a href="https://okko-digital.fr/contact" rel="nofollow">Agence</a>','https://example.org')?.rel,'nofollow');
  await assert.rejects(()=>fetchPublic('https://127.0.0.1/'));await assert.rejects(()=>fetchPublic('https://localhost/'));await assert.rejects(()=>fetchPublic('https://169.254.169.254/'));
  const raw={slug:'test-qualite-growthpilot-google',title:'Préparer la gestion de sa fiche Google avant de déléguer',description:'Un guide pratique pour préparer les informations, les accès et les visuels utiles avant de confier le suivi de sa fiche Google à une agence.',intro:'Préparer les accès et les informations réelles de votre établissement permet de définir clairement les responsabilités. Ce guide explique comment organiser la transmission et les vérifications sans communiquer votre mot de passe.',sections:[{heading:'Préparer les responsabilités du gestionnaire',paragraphs:['Le propriétaire conserve son compte et prépare une invitation de gestionnaire. Il vérifie le nom du prestataire avant de confirmer. Cette séparation permet à chacun de travailler avec ses propres identifiants et de retrouver les accès utiles lorsque le suivi évolue.'],items:[],sourceIds:['managers']}],faq:[],checklist:['Identifier le propriétaire principal.','Préparer les photos réelles autorisées.','Vérifier les horaires avant leur modification.']};
  assert.equal(quality(raw,[]).ok,false);assert.equal(articleSchema.safeParse({...raw,slug:'<script>'}).success,false);
  await ensureGrowth();const state=await prisma.growthState.findUniqueOrThrow({where:{id:'okko'}});assert.equal(state.enabled,false);assert.equal((await startRun('TEST')).status,'PAUSED');
  try{await prisma.growthState.update({where:{id:'okko'},data:{enabled:true}});const backup=await encryptedBackup();if(!backup.ciphertext||!backup.iv||!backup.tag)throw Error('Encrypted backup absent');const decipher=createDecipheriv('aes-256-gcm',createHash('sha256').update(process.env.AUTH_SECRET!).digest(),Buffer.from(backup.iv,'base64'));decipher.setAuthTag(Buffer.from(backup.tag,'base64'));const restored=JSON.parse(Buffer.concat([decipher.update(Buffer.from(backup.ciphertext,'base64')),decipher.final()]).toString());assert.equal(restored.version,1);assert(Array.isArray(restored.opportunities));assert(!JSON.stringify(backup).includes(process.env.AUTH_SECRET!));}finally{await prisma.growthState.update({where:{id:'okko'},data:{enabled:false}});}
  console.log('Timezone, publication days, schema rejection, SSRF protection, exact backlink host and emergency pause passed.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>prisma.$disconnect());
