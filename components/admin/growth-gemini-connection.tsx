'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type GeminiConnectionStatus={connected:boolean;model:string;release:string;freeTierConfirmedAt:string|null;calibrated:boolean};
export function GrowthGeminiConnection({status}:{status:GeminiConnectionStatus}){
  const router=useRouter();const [busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false);
  async function connect(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;const values=new FormData(form);setBusy(true);setError('');setSaved(false);
    try{
      const response=await fetch('/api/admin/growthpilot/provider',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({apiKey:values.get('apiKey'),freeTierConfirmed:values.get('freeTierConfirmed')==='on'})});
      const data=await response.json();if(!response.ok)throw Error(data.error||'Connexion impossible.');setSaved(true);router.refresh();
    }catch(e){setError(e instanceof Error?e.message:'Connexion impossible.');}finally{form.reset();setBusy(false);}
  }
  return <section className="mt-7 border-y border-[#d8cebb] py-6" aria-labelledby="gemini-title">
    <h2 id="gemini-title" className="text-xl font-semibold">Rédaction avec Gemini</h2>
    <p className="mt-2 text-sm">{status.connected?`Connecté · ${status.model} · projet Free Tier confirmé`:'Gemini à connecter · publication automatique bloquée'}</p>
    <p className="mt-2 text-sm">{status.calibrated?'Le moteur a été calibré. Chaque nouveau texte reste soumis aux contrôles automatiques.':'Le premier guide restera privé pour une relecture avant d’activer les publications de ce moteur.'}</p>
    <details className="mt-3 text-sm" open={!status.connected}>
      <summary className="cursor-pointer underline">{status.connected?'Remplacer la clé Gemini':'Connecter mon projet gratuit'}</summary>
      <p className="mt-3">Dans <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio ↗</a>, crée une clé dans un projet Free Tier sans compte de facturation associé. N’active pas la facturation. Seuls les briefs et textes destinés au site sont envoyés à Google. La clé est chiffrée côté serveur et exclue des exports.</p>
      <form onSubmit={connect} className="mt-4 grid max-w-xl gap-4">
        <label>Clé API Gemini<input name="apiKey" type="password" autoComplete="off" required minLength={20} maxLength={500} className="mt-2 block w-full border border-[#cfc4b1] bg-[#faf7ef] p-3" /></label>
        <label className="flex items-start gap-3"><input name="freeTierConfirmed" type="checkbox" required className="mt-1" /><span>Je confirme que ce projet est en Free Tier, sans compte de facturation associé.</span></label>
        <button disabled={busy} className="justify-self-start border-b border-current pb-1 disabled:opacity-40">{busy?'Vérification de la clé…':'Enregistrer la connexion gratuite →'}</button>
      </form>
    </details>
    {error&&<p role="alert" className="mt-3 text-sm text-red-800">{error}</p>}
    {saved&&<p role="status" className="mt-3 text-sm">Connexion enregistrée. Aucun article n’a été publié par cette action.</p>}
  </section>;
}
