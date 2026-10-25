import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PrizeCard from "../components/PrizeCard";
import { dec } from "../lib/machine";

export default function CardPage() {
  const card = dec(useParams().data);
  const key = `clawvely:redeemed:${card?.id}`;
  const [done, setDone] = useState(() => {
    try { return localStorage.getItem(key) === "1"; } catch { return false; }
  });

  if (!card?.t) {
    return (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p className="font-display text-3xl font-bold">Kartu ini tidak bisa dibuka</p>
          <Link className="btn mt-4" to="/">Ke beranda</Link>
        </div>
      </main>
    );
  }

  const redeem = () => {
    try { localStorage.setItem(key, "1"); } catch { /* penyimpanan tidak tersedia */ }
    setDone(true);
  };

  return (
    <main className="mx-auto max-w-sm space-y-6 px-5 py-10 text-center">
      <h1 className="font-display text-4xl font-bold">Bukti hadiah dari dia</h1>
      <PrizeCard card={card} redeemed={done} />
      {done ? (
        <p className="font-display text-2xl font-bold">Hadiah sudah ditebus.</p>
      ) : (
        <button className="btn" onClick={redeem}>Tebus hadiah ini</button>
      )}
    </main>
  );
}
