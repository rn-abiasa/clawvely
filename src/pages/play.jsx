import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ClawMachine from "../components/ClawMachine";
import PrizeCard from "../components/PrizeCard";
import { dec, enc, shareLink } from "../lib/machine";

export default function Play() {
  const m = dec(useParams().data);
  const [round, setRound] = useState(0);
  const [card, setCard] = useState(null);
  const [status, setStatus] = useState("");

  if (!m?.p?.length) {
    return (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="font-display text-3xl font-bold">Link mesin ini tidak bisa dibuka</p>
          <Link className="btn mt-4" to="/">Buat mesin baru</Link>
        </div>
      </main>
    );
  }

  const win = (p) =>
    setCard({ id: Math.random().toString(36).slice(2, 6).toUpperCase(), m: m.n, f: m.f, t: p.t, r: p.r, d: new Date().toISOString() });
  const send = async () =>
    setStatus(await shareLink(`${location.origin}/c/${enc(card)}`, `Aku menang "${card.t}" dari mesin capitmu! Tebus ya.`));
  const again = () => { setCard(null); setStatus(""); setRound((r) => r + 1); };

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <h1 className="font-display text-4xl leading-tight font-bold">{m.f} menyiapkan {m.p.length} hadiah buat kamu</h1>
      <p className="mb-4">Geser capitnya, lalu tekan Capit!</p>
      <ClawMachine key={round} name={m.n} prizes={m.p} play onWin={win} />

      {card && (
        <div className="fixed inset-0 z-10 grid place-items-center overflow-y-auto bg-ink/60 p-5">
          <div className="w-full max-w-xs animate-pop space-y-4 text-center">
            <p className="font-display text-3xl font-bold text-paper">Kamu dapat hadiah!</p>
            <PrizeCard card={card} />
            <div className="flex flex-col gap-3">
              <button className="btn" onClick={send}>Kirim bukti ke {m.f}</button>
              <button className="btn btn-alt" onClick={again}>Main lagi</button>
            </div>
            <p role="status" className="min-h-5 text-sm text-paper">{status}</p>
          </div>
        </div>
      )}
    </main>
  );
}
