import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GiftItem from "../components/GiftItem";
import { cleanId } from "../lib/machine";
import { rpc } from "../lib/supabase";

export default function CardPage() {
  const id = cleanId(useParams().id);
  const [card, setCard] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    rpc("get_claim", { p_claim_id: id })
      .then((r) => (r ? setCard(r) : setFailed("Hadiah tidak ditemukan.")))
      .catch((e) => setFailed(e.message));
  }, [id]);

  if (failed) {
    return (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="space-y-4">
          <p className="font-display text-3xl font-bold">Hadiah ini tidak bisa dibuka</p>
          <p className="text-sm opacity-70">{failed}</p>
          <Link className="btn" to="/">Ke beranda</Link>
        </div>
      </main>
    );
  }
  if (!card) return <p className="p-10 text-center font-display text-2xl">Membuka hadiah...</p>;

  return (
    <main className="mx-auto max-w-md space-y-6 px-5 py-10 text-center">
      <h1 className="font-display text-4xl font-bold">Dia sudah membuka hadiah ini</h1>
      <GiftItem kind={card.kind} data={card.data} from={card.from} />
      <p className="text-sm">Dari mesin <b>{card.name}</b></p>
    </main>
  );
}
