import { RARITY } from "../lib/machine";

const BAND = { biasa: "bg-mint", langka: "bg-plum", legendaris: "foil" };

export default function PrizeCard({ card, redeemed = false }) {
  return (
    <article className="relative w-full overflow-hidden rounded-3xl border-[3px] border-ink bg-paper text-left shadow-[4px_4px_0_var(--color-ink)]">
      <div className={`${BAND[card.r]} flex items-center justify-between border-b-[3px] border-dashed border-ink px-4 py-2.5`}>
        <span className="font-display text-xl font-bold">Kupon hadiah</span>
        <span className="rounded-full border-2 border-ink bg-paper px-3 py-0.5 text-xs font-extrabold">{RARITY[card.r].label}</span>
      </div>
      <div className="px-4 pt-4 pb-4">
        <p className="font-display text-3xl leading-tight font-bold">{card.t}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0 text-xs">
            <p className="text-sm">Dari mesin <b>{card.m}</b> milik {card.f}</p>
            <p className="mt-1 opacity-70">{new Date(card.d).toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
            <p className="opacity-70">Kode: {card.id}</p>
          </div>
          {redeemed && (
            <div className="shrink-0 animate-stamp rounded-xl border-[3px] border-coral px-2 py-0.5 font-display text-2xl font-bold text-coral">
              Sudah ditebus
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
