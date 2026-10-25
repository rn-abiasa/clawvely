import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PrizeCard from "../components/PrizeCard";
import { cleanId } from "../lib/machine";
import { rpc } from "../lib/supabase";

export default function CardPage() {
  const id = cleanId(useParams().id);
  const [card, setCard] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    rpc("get_claim", { p_claim_id: id })
      .then((r) => (r ? setCard({ ...r, id: r.code }) : setFailed("Kartu tidak ditemukan.")))
      .catch((e) => setFailed(e.message));
  }, [id]);

  if (failed) {
    return (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="space-y-4">
          <p className="font-display text-3xl font-bold">Kartu ini tidak bisa dibuka</p>
          <p className="text-sm opacity-70">{failed}</p>
          <Link className="btn" to="/">Ke beranda</Link>
        </div>
      </main>
    );
  }
  if (!card) return <p className="p-10 text-center font-display text-2xl">Membuka kartu...</p>;

  return (
    <main className="mx-auto max-w-md space-y-6 px-5 py-10 text-center">
      <h1 className="font-display text-4xl font-bold">Bukti hadiah</h1>
      <PrizeCard card={card} redeemed={!!card.redeemed_at} />
      <p className="font-display text-2xl font-bold">
        {card.redeemed_at ? "Hadiah sudah ditebus." : `Menunggu ${card.f} menebus hadiah ini.`}
      </p>
    </main>
  );
}
