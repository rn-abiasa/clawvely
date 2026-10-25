import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GiftIcon } from "../components/Icons";
import { KINDS, cleanId } from "../lib/machine";
import { rpc, supabase } from "../lib/supabase";

export default function Owner() {
  const token = cleanId(useParams().token);
  const [d, setD] = useState(null);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await rpc("get_owner_dashboard", { p_owner_token: token });
      r ? setD(r) : setFailed(true);
    } catch {
      setFailed(true);
    }
  }, [token]);

  useEffect(() => {
    load();
    const poll = setInterval(load, 20000); // cadangan kalau realtime putus
    const ch = supabase.channel(`machine:${token}`).on("broadcast", { event: "claim" }, load).subscribe();
    return () => {
      clearInterval(poll);
      supabase.removeChannel(ch);
    };
  }, [load, token]);

  if (failed) {
    return (
      <main className="grid min-h-dvh place-items-center p-6 text-center">
        <div className="space-y-4">
          <p className="font-display text-3xl font-bold">Dashboard tidak ditemukan</p>
          <Link className="btn" to="/">Ke beranda</Link>
        </div>
      </main>
    );
  }
  if (!d) return <p className="p-10 text-center font-display text-2xl">Membuka dashboard...</p>;

  const playUrl = `${location.origin}/m/${d.play_id}`;
  const opened = d.prizes.filter((p) => p.opened_at).length;

  return (
    <main className="mx-auto max-w-md space-y-6 px-5 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-bold">{d.name}</h1>
        <p>{opened} dari {d.prizes.length} kejutan sudah dibuka.</p>
        <p className="rounded-lg bg-paper p-2 text-xs break-all">{playUrl}</p>
        <button className="btn !text-xl" onClick={async () => { await navigator.clipboard.writeText(playUrl); setCopied(true); }}>
          {copied ? "Tersalin" : "Salin link untuk dia"}
        </button>
      </header>

      <ul className="space-y-3">
        {d.prizes.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-2xl border-[2.5px] border-ink bg-paper px-3 py-2 shadow-[3px_3px_0_var(--color-ink)]">
            <GiftIcon kind={p.kind} size={36} />
            <div className="min-w-0 flex-1">
              <p className="font-bold">{KINDS[p.kind].label}</p>
              <p className="text-sm">
                {p.opened_at ? `Dibuka ${new Date(p.opened_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}` : "Belum dibuka"}
              </p>
            </div>
            {p.claim_id && <Link className="text-sm font-bold underline" to={`/c/${p.claim_id}`}>Lihat</Link>}
          </li>
        ))}
      </ul>
    </main>
  );
}
