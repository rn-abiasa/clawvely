import { RARITY } from "../lib/machine";

const BAND = { biasa: "bg-mint", langka: "bg-plum", legendaris: "foil" };

export default function PrizeCard({ card, redeemed = false }) {
  return (
    <article className="relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl border-[3px] border-ink bg-paper shadow-[5px_5px_0_var(--color-ink)]">
      <div className={`${BAND[card.r]} flex items-center justify-between border-b-[3px] border-dashed border-ink px-5 py-3`}>
        <span className="font-display text-2xl font-bold">Kupon hadiah</span>
        <span className="rounded-full border-2 border-ink bg-paper px-3 py-0.5 text-sm font-extrabold">{RARITY[card.r].label}</span>
      </div>
      <div className="px-5 pt-6 pb-8">
        <p className="font-display text-4xl leading-tight font-bold">{card.t}</p>
        <p className="mt-5 text-sm">Dari mesin <b>{card.m}</b> milik {card.f}</p>
        <p className="mt-1 text-xs opacity-70">{new Date(card.d).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
        <p className="text-xs opacity-70">Kode: {card.id}</p>
      </div>
      {redeemed && (
        <div className="absolute right-4 bottom-6 animate-stamp rounded-xl border-4 border-coral px-3 py-1 font-display text-3xl font-bold text-coral">
          Sudah ditebus
        </div>
      )}
    </article>
  );
}
