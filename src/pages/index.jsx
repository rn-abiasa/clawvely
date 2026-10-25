import { useState } from "react";
import { Link } from "react-router-dom";
import ClawMachine from "../components/ClawMachine";
import { RARITY, RARITY_ORDER } from "../lib/machine";
import { rpc } from "../lib/supabase";

const seed = [
  { t: "Nonton bareng, tiketnya aku yang beli", r: "biasa" },
  { t: "Traktir boba bebas topping", r: "langka" },
  { t: "Kencan sehari penuh, kamu yang pilih", r: "legendaris" },
];

export default function Index() {
  const [name, setName] = useState("Mesin Hadiah");
  const [from, setFrom] = useState("");
  const [prizes, setPrizes] = useState(seed);
  const [maxWins, setMaxWins] = useState(1);
  const [made, setMade] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const saved = (() => { try { return localStorage.getItem("clawvely:owner"); } catch { return null; } })();

  const ready = from.trim() && prizes.every((p) => p.t.trim());
  const edit = (i, patch) => setPrizes((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const cycle = (i) => edit(i, { r: RARITY_ORDER[(RARITY_ORDER.indexOf(prizes[i].r) + 1) % 3] });

  const make = async () => {
    setBusy(true);
    setErr("");
    try {
      const r = await rpc("create_machine", {
        p_name: name.trim() || "Mesin Hadiah",
        p_from: from.trim(),
        p_prizes: prizes.map((p) => ({ t: p.t.trim(), r: p.r })),
        p_max_wins: maxWins,
      });
      try { localStorage.setItem("clawvely:owner", r.owner_token); } catch { /* abaikan */ }
      setMade(r);
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };
  const copy = async (key, url) => {
    await navigator.clipboard.writeText(url);
    setCopied(key);
  };
  const playUrl = made && `${location.origin}/m/${made.play_id}`;
  const ownerUrl = made && `${location.origin}/o/${made.owner_token}`;

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 md:grid md:grid-cols-2 md:items-start md:gap-10">
      <section className="md:sticky md:top-8">
        <h1 className="font-display text-5xl font-bold">Clawvely</h1>
        <p className="mb-4 text-lg">Isi mesinnya, kirim ke dia, biar dia yang menangkap hadiahnya.</p>
        <ClawMachine name={name} prizes={prizes} />
      </section>

      <section className="mt-8 space-y-5 md:mt-0">
        {saved && <Link className="font-bold underline" to={`/o/${saved}`}>Buka dashboard mesin terakhirmu</Link>}
        <label className="block">
          <span className="font-bold">Nama mesin</span>
          <input className="field mt-1" value={name} maxLength={18} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="font-bold">Namamu</span>
          <input className="field mt-1" value={from} maxLength={20} placeholder="Supaya dia tahu ini dari siapa" onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="block">
          <span className="font-bold">Dia boleh menang berapa hadiah?</span>
          <select className="field mt-1" value={maxWins} onChange={(e) => setMaxWins(+e.target.value)}>
            {[1, 2, 3].map((n) => <option key={n} value={n}>{n} hadiah</option>)}
          </select>
        </label>

        <fieldset className="space-y-3">
          <legend className="font-bold">Hadiah ({prizes.length}/6)</legend>
          {prizes.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input className="field min-w-0" aria-label={`Hadiah ${i + 1}`} value={p.t} maxLength={60} onChange={(e) => edit(i, { t: e.target.value })} />
              <button type="button" className="btn btn-alt !w-[6.2rem] shrink-0 !px-2 !text-base" title="Ganti kelangkaan" onClick={() => cycle(i)}>{RARITY[p.r].label}</button>
              {prizes.length > 3 && (
                <button type="button" className="btn btn-alt shrink-0 !px-3" aria-label={`Hapus hadiah ${i + 1}`} onClick={() => setPrizes(prizes.filter((_, j) => j !== i))}>×</button>
              )}
            </div>
          ))}
          {prizes.length < 6 && (
            <button type="button" className="btn btn-alt !text-xl" onClick={() => setPrizes([...prizes, { t: "", r: "biasa" }])}>Tambah hadiah</button>
          )}
        </fieldset>

        <button className="btn" disabled={!ready || busy} onClick={make}>{busy ? "Membuat mesin..." : "Buat mesin"}</button>
        {err && <p role="alert" className="font-bold text-coral">{err}</p>}

        {made && (
          <div className="space-y-4 rounded-2xl border-[2.5px] border-ink bg-paper p-4">
            <p className="font-bold">Mesinmu siap.</p>
            {[
              ["play", "Kirim link ini ke dia", playUrl],
              ["owner", "Simpan link ini untuk dirimu sendiri (dashboard hadiah)", ownerUrl],
            ].map(([key, label, url]) => (
              <div key={key} className="space-y-2">
                <p className="text-sm">{label}</p>
                <p className="rounded-lg bg-wall p-2 text-xs break-all">{url}</p>
                <button className="btn !text-xl" onClick={() => copy(key, url)}>{copied === key ? "Tersalin" : "Salin link"}</button>
              </div>
            ))}
            <Link className="btn btn-alt !text-xl" to={`/o/${made.owner_token}`}>Buka dashboard</Link>
          </div>
        )}
      </section>
    </main>
  );
}
