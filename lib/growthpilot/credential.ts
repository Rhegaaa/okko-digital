import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const aad=Buffer.from('OKKO GrowthPilot Gemini credential v1');
function key(){
  if(!process.env.AUTH_SECRET)throw Error('Secret de chiffrement absent.');
  return createHash('sha256').update('growthpilot:gemini:v1:').update(process.env.AUTH_SECRET).digest();
}
export function encryptCredential(value:string){
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(),iv);cipher.setAAD(aad);
  const data=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);
  return JSON.stringify({v:1,iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),data:data.toString('base64')});
}
export function decryptCredential(value:string){
  const b=JSON.parse(value);if(b.v!==1)throw Error('Version de clé invalide.');
  const decipher=createDecipheriv('aes-256-gcm',key(),Buffer.from(b.iv,'base64'));decipher.setAAD(aad);decipher.setAuthTag(Buffer.from(b.tag,'base64'));
  return Buffer.concat([decipher.update(Buffer.from(b.data,'base64')),decipher.final()]).toString('utf8');
}
