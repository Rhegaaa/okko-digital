import assert from 'node:assert/strict';
import { articleSchema,quality,publicationDay,frenchDay,weekStart } from '../lib/growthpilot/content';
import { backlinkIn,fetchPublic } from '../lib/growthpilot/network';
import { ensureGrowth,startRun } from '../lib/growthpilot/engine';
import { prisma } from '../lib/db';
async function main(){
  assert.equal(frenchDay(new Date('2026-10-25T23:30:00Z')),'2026-10-26');assert.equal(publicationDay(new Date('2026-10-16T08:00:00Z')),true);assert.equal(publicationDay(new Date('2026-10-17T08:00:00Z')),false);assert.equal(weekStart(new Date('2026-10-18T08:00:00Z')).toISOString().slice(0,10),'2026-10-12');
  assert.equal(backlinkIn('<a href="https://okko-digital.fr.evil.test/">faux</a>','https://example.org'),null);assert.equal(backlinkIn('<a href="https://okko-digital.fr/contact" rel="nofollow">Agence</a>','https://example.org')?.rel,'nofollow');
  await assert.rejects(()=>fetchPublic('https://127.0.0.1/'));await assert.rejects(()=>fetchPublic('https://localhost/'));await assert.rejects(()=>fetchPublic('https://169.254.169.254/'));
  const raw={slug:'test-qualite-growthpilot-google',title:'Préparer la gestion de sa fiche Google avant de déléguer',description:'Un guide pratique pour préparer les informations, les accès et les visuels utiles avant de confier le suivi de sa fiche Google à une agence.',intro:'Préparer les accès et les informations réelles de votre établissement permet de définir clairement les responsabilités. Ce guide explique comment organiser la transmission et les vérifications sans communiquer votre mot de passe.',sections:[{heading:'Préparer les responsabilités du gestionnaire',paragraphs:['Le propriétaire conserve son compte et prépare une invitation de gestionnaire. Il vérifie le nom du prestataire avant de confirmer. Cette séparation permet à chacun de travailler avec ses propres identifiants et de retrouver les accès utiles lorsque le suivi évolue.'],items:[],sourceIds:['managers']}],faq:[],checklist:['Identifier le propriétaire principal.','Préparer les photos réelles autorisées.','Vérifier les horaires avant leur modification.']};
  assert.equal(quality(raw,[]).ok,false);assert.equal(articleSchema.safeParse({...raw,slug:'<script>'}).success,false);
  await ensureGrowth();const state=await prisma.growthState.findUniqueOrThrow({where:{id:'okko'}});assert.equal(state.enabled,false);assert.equal((await startRun('TEST')).status,'PAUSED');
  console.log('Timezone, publication days, schema rejection, SSRF protection, exact backlink host and emergency pause passed.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>prisma.$disconnect());
