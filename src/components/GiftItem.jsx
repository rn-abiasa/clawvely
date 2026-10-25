import { useState } from "react";
import { STAMPS, compressImage, parseYouTube } from "../lib/machine";
import StampArt from "./StampArt";

const SHADOW = "shadow-[4px_4px_0_var(--color-ink)]";
const bare = "w-full bg-transparent outline-none placeholder:opacity-45 focus-visible:bg-white/40";

// Setiap hadiah punya mode lihat dan mode isi (edit): form-nya adalah bendanya sendiri.

function Message({ d, edit, onChange }) {
  return (
    <div className="mx-auto w-full max-w-xs animate-pop">
      <svg viewBox="0 0 300 70" className="relative top-1 block w-full" aria-hidden="true">
        <path d="M8 68L150 8L292 68Z" fill="#E9B9A8" stroke="#3A2822" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="150" cy="44" r="11" fill="#EE6F5B" stroke="#3A2822" strokeWidth="3" />
      </svg>
      <div className={`-rotate-1 rounded-b-2xl border-[3px] border-ink bg-paper p-5 ${SHADOW}`} style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgba(91,143,212,.35) 31px 32px)", backgroundPosition: "0 18px" }}>
        {edit ? (
          <textarea aria-label="Isi pesan" className={`${bare} min-h-40 resize-none font-display text-2xl`} style={{ lineHeight: "32px" }} maxLength={300} placeholder="Tulis pesanmu di atas kertas ini..." value={d.text || ""} onChange={(e) => onChange({ text: e.target.value })} />
        ) : (
          <p className="font-display text-2xl whitespace-pre-wrap" style={{ lineHeight: "32px" }}>{d.text}</p>
        )}
      </div>
    </div>
  );
}

function Song({ d, edit, onChange }) {
  const [play, setPlay] = useState(false);
  const [link, setLink] = useState(d.yt ? `https://youtu.be/${d.yt}` : "");
  const start = () => {
    setPlay(true);
    window.dispatchEvent(new Event("clawvely:duck")); // matikan backsound
  };
  const disc = (
    <span
      className={`absolute inset-0 rounded-full border-[3px] border-ink bg-[#4A3B40] ${SHADOW} ${play ? "animate-[spin_4s_linear_infinite]" : ""}`}
      style={{ backgroundImage: "repeating-radial-gradient(circle, transparent 0 6px, rgba(255,255,255,.08) 6px 7px)" }}
    >
      {d.yt ? (
        <img src={`https://img.youtube.com/vi/${d.yt}/hqdefault.jpg`} alt="" className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-butter object-cover" />
      ) : (
        <span className="absolute top-1/2 left-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-butter font-display text-3xl">♪</span>
      )}
      <span className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-wall" />
    </span>
  );

  return (
    <div className="mx-auto w-full max-w-xs animate-pop text-center">
      {edit ? (
        <div className="relative mx-auto h-48 w-48">{disc}</div>
      ) : (
        <button onClick={start} aria-label="Putar lagu" className="relative mx-auto block h-52 w-52 cursor-pointer">{disc}</button>
      )}
      {edit ? (
        <div className={`mt-5 space-y-1 rounded-2xl border-[3px] border-ink bg-paper px-4 py-3 text-left ${SHADOW}`}>
          <input aria-label="Link YouTube" className={`${bare} text-sm`} inputMode="url" placeholder="Tempel link YouTube di sini" value={link} onChange={(e) => { setLink(e.target.value); onChange({ yt: parseYouTube(e.target.value) }); }} />
          {link && !d.yt && <p role="alert" className="text-xs font-bold text-coral">Link YouTube tidak dikenali.</p>}
          <input aria-label="Judul lagu" className={`${bare} border-t-2 border-dashed border-ink/40 pt-2 font-display text-2xl`} maxLength={50} placeholder="Judul atau kata pengantar" value={d.title || ""} onChange={(e) => onChange({ title: e.target.value })} />
        </div>
      ) : (
        <>
          <p className="mt-4 font-display text-3xl leading-tight font-bold">{d.title || "Lagu untukmu"}</p>
          {play ? (
            <iframe title="Pemutar lagu" className="mt-3 h-[200px] w-full rounded-2xl border-[3px] border-ink" src={`https://www.youtube-nocookie.com/embed/${d.yt}?autoplay=1&playsinline=1`} allow="autoplay; encrypted-media" allowFullScreen />
          ) : (
            <p className="text-sm">Ketuk piringan untuk memutar</p>
          )}
          <a className="mt-2 inline-block text-sm underline" href={`https://www.youtube.com/watch?v=${d.yt}`} target="_blank" rel="noreferrer">Buka di YouTube</a>
        </>
      )}
    </div>
  );
}

function Photo({ d, edit, onChange }) {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try { onChange({ img: await compressImage(f) }); } catch { /* foto tidak terbaca */ }
    setBusy(false);
  };
  return (
    <div className={`relative mx-auto w-full max-w-[17rem] rotate-2 animate-pop border-[3px] border-ink bg-white p-3 pb-4 ${SHADOW}`}>
      <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-butter/80" />
      {edit ? (
        <label className="relative block aspect-square w-full cursor-pointer overflow-hidden bg-sky/40 focus-within:outline-4 focus-within:outline-sky">
          {d.img ? (
            <img src={d.img} alt="Foto pilihanmu" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full place-items-center border-2 border-dashed border-ink p-4 text-center font-display text-2xl">{busy ? "Mengecilkan foto..." : "Ketuk untuk memilih foto"}</span>
          )}
          <input type="file" accept="image/*" className="sr-only" onChange={pick} />
        </label>
      ) : (
        <img src={d.img} alt={d.caption || "Foto kenangan"} className="aspect-square w-full object-cover" style={{ filter: "sepia(.2) saturate(1.1)" }} />
      )}
      {edit ? (
        <input aria-label="Keterangan foto" className={`${bare} mt-3 text-center font-display text-2xl`} maxLength={40} placeholder="Tulis keterangan" value={d.caption || ""} onChange={(e) => onChange({ caption: e.target.value })} />
      ) : (
        <p className="mt-3 min-h-8 text-center font-display text-2xl leading-tight">{d.caption}</p>
      )}
    </div>
  );
}

function Voucher({ d, edit, onChange }) {
  return (
    <div className={`mx-auto w-full max-w-xs -rotate-1 animate-pop rounded-2xl border-[3px] border-ink bg-butter ${SHADOW}`}>
      <div className="px-5 pt-4 pb-3">
        <p className="font-display text-lg">Voucher hadiah</p>
        {edit ? (
          <input aria-label="Isi voucher" className={`${bare} font-display text-3xl leading-tight font-bold`} maxLength={40} placeholder="Voucher pulsa 25rb" value={d.title || ""} onChange={(e) => onChange({ title: e.target.value })} />
        ) : (
          <p className="font-display text-3xl leading-tight font-bold">{d.title}</p>
        )}
      </div>
      <div className="flex items-end justify-between gap-3 border-t-[3px] border-dashed border-ink px-5 py-3">
        {edit ? (
          <input aria-label="Catatan voucher" className={`${bare} text-sm`} maxLength={100} placeholder="Catatan (opsional)" value={d.note || ""} onChange={(e) => onChange({ note: e.target.value })} />
        ) : (
          <p className="text-sm">{d.note || "Tunjukkan ke pembuat mesin ini"}</p>
        )}
        <span className="h-8 w-16 shrink-0" style={{ background: "repeating-linear-gradient(90deg,#3A2822 0 2px,transparent 2px 5px,#3A2822 5px 6px,transparent 6px 9px)" }} />
      </div>
    </div>
  );
}

function Stamp({ d, from, edit, onChange }) {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
      <StampArt id={d.s} className={`w-52 ${edit ? "" : "animate-stamp"}`} />
      {edit ? (
        <div className="grid w-full grid-cols-4 gap-2" role="group" aria-label="Pilih prangko">
          {STAMPS.map((s) => (
            <button key={s.id} type="button" aria-label={s.title} aria-pressed={d.s === s.id} onClick={() => onChange({ s: s.id })} className="rounded-lg p-1 transition-transform aria-pressed:scale-110 aria-pressed:bg-paper aria-pressed:ring-4 aria-pressed:ring-sky">
              <StampArt id={s.id} className="w-full" />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs">Prangko dari {from}</p>
      )}
    </div>
  );
}

export default function GiftItem({ kind, data = {}, from, edit = false, onChange }) {
  const p = { d: data, from, edit, onChange };
  if (kind === "message") return <Message {...p} />;
  if (kind === "song") return <Song {...p} />;
  if (kind === "photo") return <Photo {...p} />;
  if (kind === "voucher") return <Voucher {...p} />;
  return <Stamp {...p} />;
}
