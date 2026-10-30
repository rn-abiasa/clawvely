import { useState } from "react";
import { KINDS, STAMPS } from "../lib/machine";
import GiftItem from "./GiftItem";

// Lembar isi: benda hadiahnya sendiri menjadi form (ketik langsung di surat, vinyl, polaroid, tiket).
export default function PrizeEditor({ prize, isNew, onSave, onDelete, onCancel }) {
  const k = prize.k;
  const [d, setD] = useState(k === "stamp" && !prize.d.s ? { s: STAMPS[0].id } : prize.d);
  const set = (patch) => setD((x) => ({ ...x, ...patch }));

  const valid = {
    message: !!d.text?.trim(),
    song: !!d.yt,
    photo: !!d.img,
    voucher: !!d.title?.trim(),
    stamp: !!d.s,
  }[k];

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/60 backdrop-blur-sm md:items-center" onClick={onCancel}>
      <div role="dialog" aria-label={`Fill in ${KINDS[k].label}`} className="max-h-[92dvh] w-full max-w-md space-y-5 overflow-y-auto rounded-t-3xl border-[3px] border-ink bg-wall px-5 pt-6 pb-5 md:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <h2 className="font-display text-3xl leading-none font-bold">{KINDS[k].label}</h2>
          <p className="text-sm">{KINDS[k].hint}</p>
        </div>

        <GiftItem kind={k} data={d} from="you" edit onChange={set} />

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button className="btn" disabled={!valid} onClick={() => onSave({ k, d })}>Save</button>
          <button className="btn btn-alt" onClick={onCancel}>Cancel</button>
          {!isNew && <button className="btn btn-alt" onClick={onDelete}>Delete ball</button>}
        </div>
      </div>
    </div>
  );
}
