import { useState } from "react";
import { Link } from "react-router-dom";
import ClawMachine from "../components/ClawMachine";
import { RARITY, RARITY_ORDER, enc } from "../lib/machine";

const seed = [
  { t: "Nonton bareng, tiketnya aku yang beli", r: "biasa" },
  { t: "Traktir boba bebas topping", r: "langka" },
  { t: "Kencan sehari penuh, kamu yang pilih", r: "legendaris" },
];

export default function Index() {
  const [name, setName] = useState("Mesin Hadiah");
  const [from, setFrom] = useState("");
  const [prizes, setPrizes] = useState(seed);
  const [data, setData] = useState("");
  const [copied, setCopied] = useState(false);

  const ready = from.trim() && prizes.every((p) => p.t.trim());
  const edit = (i, patch) => setPrizes((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const cycle = (i) => edit(i, { r: RARITY_ORDER[(RARITY_ORDER.indexOf(prizes[i].r) + 1) % 3] });
  const make = () => {
    setData(enc({ n: name.trim() || "Mesin Hadiah", f: from.trim(), p: prizes.map((p) => ({ t: p.t.trim(), r: p.r })) }));
    setCopied(false);
  };
  const link = `${location.origin}/m/${data}`;
  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 md:grid md:grid-cols-2 md:items-start md:gap-10">
      <section>
        <h1 className="font-display text-5xl font-bold">Clawvely</h1>
        <p className="mb-4 text-lg">Isi mesinnya, kirim ke dia, biar dia yang menangkap hadiahnya.</p>
        <ClawMachine name={name} prizes={prizes} />
      </section>

      <section className="mt-8 space-y-5 md:mt-0">
        <label className="block">
          <span className="font-bold">Nama mesin</span>
          <input className="field mt-1" value={name} maxLength={18} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="font-bold">Namamu</span>
          <input className="field mt-1" value={from} maxLength={20} placeholder="Supaya dia tahu ini dari siapa" onChange={(e) => setFrom(e.target.value)} />
        </label>

        <fieldset className="space-y-3">
          <legend className="font-bold">Hadiah ({prizes.length}/6)</legend>
          {prizes.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input className="field" aria-label={`Hadiah ${i + 1}`} value={p.t} maxLength={60} onChange={(e) => edit(i, { t: e.target.value })} />
              <button type="button" className="btn btn-alt !px-3 !text-base" title="Ganti kelangkaan" onClick={() => cycle(i)}>{RARITY[p.r].label}</button>
              {prizes.length > 3 && (
                <button type="button" className="btn btn-alt !px-3" aria-label={`Hapus hadiah ${i + 1}`} onClick={() => setPrizes(prizes.filter((_, j) => j !== i))}>×</button>
              )}
            </div>
          ))}
          {prizes.length < 6 && (
            <button type="button" className="btn btn-alt !text-xl" onClick={() => setPrizes([...prizes, { t: "", r: "biasa" }])}>Tambah hadiah</button>
          )}
        </fieldset>

        <button className="btn" disabled={!ready} onClick={make}>Buat link mesin</button>

        {data && (
          <div className="space-y-3 rounded-2xl border-[2.5px] border-ink bg-paper p-4">
            <p className="font-bold">Mesinmu siap. Kirim link ini ke dia:</p>
            <p className="rounded-lg bg-wall p-2 text-xs break-all">{link}</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn !text-xl" onClick={copy}>{copied ? "Tersalin" : "Salin link"}</button>
              <Link className="btn btn-alt !text-xl" to={`/m/${data}`}>Coba main dulu</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
