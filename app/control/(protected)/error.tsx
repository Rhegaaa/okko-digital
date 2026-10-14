'use client';
export default function ControlError({reset}:{reset:()=>void}) {
  return <section className="text-[#163c31]"><h1 className="text-2xl font-semibold">Le suivi est momentanément indisponible.</h1><p className="mt-3 text-sm">Les données n’ont pas pu être chargées. Réessaie avant d’ajouter ou de modifier une action.</p><button className="mt-6 border-b border-current pb-1" onClick={reset}>Réessayer →</button></section>;
}
