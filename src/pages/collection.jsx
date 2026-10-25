import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GiftItem from "../components/GiftItem";
import { GiftIcon } from "../components/Icons";
import { cleanId, giftLabel } from "../lib/machine";
import { rpc } from "../lib/supabase";

export default function Collection() {
  const id = cleanId(useParams().id);
  const [d, setD] = useState(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    rpc("get_collection", { p_play_id: id })
      .then((r) => (r ? setD(r) : setFailed(true)))
      .catch(() => setFailed(true));
  }, [id]);

  if (failed) {
    return (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="space-y-4">
          <p className="font-display text-3xl font-bold">Koleksi tidak bisa dibuka</p>
          <Link className="btn" to="/">Ke beranda</Link>
        </div>
      </main>
    );
  }
  if (!d) return <p className="p-10 text-center font-display text-2xl">Membuka koleksi...</p>;

  const remaining = d.total - d.items.length;
  return (
    <main className="mx-auto max-w-md space-y-6 px-5 py-8">
      <header>
        <h1 className="font-display text-4xl font-bold">Koleksi dari {d.from}</h1>
        <p>{d.items.length} dari {d.total} kejutan sudah kamu buka.</p>
      </header>

      {d.items.length === 0 && <p className="font-display text-2xl">Belum ada hadiah. Capit dulu ya.</p>}
      <ul className="grid grid-cols-2 gap-3">
        {d.items.map((it) => (
          <li key={it.id}>
            <button className="flex h-full w-full flex-col items-center gap-2 rounded-2xl border-[2.5px] border-ink bg-paper p-3 text-center shadow-[3px_3px_0_var(--color-ink)]" onClick={() => setOpen(it)}>
              {it.kind === "photo" && it.data.img ? (
                <img src={it.data.img} alt="" className="h-20 w-20 rounded-lg border-2 border-ink object-cover" />
              ) : (
                <GiftIcon kind={it.kind} size={64} />
              )}
              <span className="line-clamp-2 text-sm font-bold">{giftLabel(it.kind, it.data)}</span>
            </button>
          </li>
        ))}
      </ul>

      {remaining > 0 && <Link className="btn" to={`/m/${id}`}>Capit lagi ({remaining} bola tersisa)</Link>}

      {open && (
        <div className="fixed inset-0 z-10 grid place-items-center overflow-y-auto bg-ink/70 p-5" onClick={() => setOpen(null)}>
          <div className="w-full max-w-xs space-y-5 py-6 text-center" onClick={(e) => e.stopPropagation()}>
            <GiftItem kind={open.kind} data={open.data} from={d.from} />
            <button className="btn btn-alt" onClick={() => setOpen(null)}>Tutup</button>
          </div>
        </div>
      )}
    </main>
  );
}
