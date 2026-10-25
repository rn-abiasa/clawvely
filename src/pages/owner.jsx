import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PrizeCard from "../components/PrizeCard";
import { rpc, supabase } from "../lib/supabase";

export default function Owner() {
  const { token } = useParams();
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

  const redeem = async (claimId) => {
    await rpc("redeem_claim", { p_owner_token: token, p_claim_id: claimId });
    load();
  };
  const playUrl = d && `${location.origin}/m/${d.play_id}`;

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

  return (
    <main className="mx-auto max-w-md space-y-6 px-5 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-bold">{d.name}</h1>
        <p>{d.claims.length} dari {d.max_wins} hadiah sudah dimenangkan.</p>
        <p className="rounded-lg bg-paper p-2 text-xs break-all">{playUrl}</p>
        <button className="btn !text-xl" onClick={async () => { await navigator.clipboard.writeText(playUrl); setCopied(true); }}>
          {copied ? "Tersalin" : "Salin link untuk dia"}
        </button>
      </header>

      {d.claims.length === 0 && <p className="font-display text-2xl">Belum ada yang menang. Kirim link mesin ke dia dulu.</p>}

      {d.claims.map((c) => (
        <div key={c.id} className="space-y-3">
          <PrizeCard card={{ id: c.code, t: c.t, r: c.r, m: d.name, f: d.from, d: c.won_at }} redeemed={!!c.redeemed_at} />
          {!c.redeemed_at && <button className="btn mx-auto flex" onClick={() => redeem(c.id)}>Tebus hadiah ini</button>}
        </div>
      ))}
    </main>
  );
}
