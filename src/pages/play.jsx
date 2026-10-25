import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ClawMachine from "../components/ClawMachine";
import Reveal from "../components/Reveal";
import Scene from "../components/Scene";
import { cleanId, shareLink } from "../lib/machine";
import { rpc } from "../lib/supabase";

const Notice = ({ text, children }) => (
  <main className="grid min-h-dvh place-items-center p-6 text-center">
    <div className="space-y-4">
      <p className="font-display text-3xl font-bold">{text}</p>
      {children}
    </div>
  </main>
);

export default function Play() {
  const id = cleanId(useParams().id);
  const nav = useNavigate();
  const [m, setM] = useState(null);
  const [left, setLeft] = useState([]);
  const [failed, setFailed] = useState(false);
  const [gift, setGift] = useState(null);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    rpc("get_machine", { p_play_id: id })
      .then((r) => (r ? (setM(r), setLeft(r.prizes)) : setFailed(true)))
      .catch(() => setFailed(true));
  }, [id]);

  if (failed) return <Notice text="Link mesin ini tidak bisa dibuka"><Link className="btn" to="/">Buat mesin baru</Link></Notice>;
  if (!m) return <Notice text="Menyalakan mesin..." />;
  if (left.length === 0 && !gift) {
    return (
      <Notice text="Semua bola sudah kamu ambil">
        <Link className="btn" to={`/k/${id}`}>Lihat koleksimu</Link>
      </Notice>
    );
  }

  const win = async (p) => {
    try {
      const c = await rpc("claim_prize", { p_play_id: id, p_prize_id: p.id });
      setLeft((l) => l.filter((x) => x.id !== p.id)); // bola hilang dari mesin
      setStatus("");
      setGift(c);
    } catch (e) {
      setStatus(e.message);
    }
  };
  const send = async () =>
    setStatus(await shareLink(`${location.origin}/c/${gift.id}`, "Aku baru buka hadiah dari mesin capitmu!"));
  const next = () => {
    if (left.length === 0) return nav(`/k/${id}`);
    setGift(null);
    setStatus("");
    setRound((r) => r + 1);
  };
  const taken = m.total - left.length;

  return (
    <main className="relative flex h-dvh flex-col items-center overflow-hidden">
      <Scene />
      <header className="relative z-[1] w-full max-w-md px-4 pt-4 text-center">
        <p className="inline-block -rotate-1 rounded-full border-[3px] border-ink bg-paper px-4 py-1 font-display text-2xl font-bold shadow-[3px_3px_0_var(--color-ink)]">
          {m.from} menyiapkan {m.total} kejutan
        </p>
        <div className="mt-2 flex items-center justify-center gap-2" role="img" aria-label={`Sisa ${left.length} bola`}>
          {Array.from({ length: m.total }, (_, i) => (
            <span key={i} className={`h-3.5 w-3.5 rounded-full border-2 border-ink ${i < left.length ? "bg-butter" : "opacity-40"}`} />
          ))}
          {taken > 0 && <Link className="ml-2 text-sm font-bold underline" to={`/k/${id}`}>Koleksi</Link>}
        </div>
      </header>

      <div className="relative z-[1] min-h-0 w-full max-w-md flex-1 px-3 pt-2 pb-4">
        <ClawMachine key={round} name={m.name} prizes={left} slots={m.total} play fit paused={!!gift} onWin={win} />
      </div>
      {!gift && status && <p role="alert" className="absolute right-0 bottom-1 left-0 z-[1] text-center font-bold text-coral">{status}</p>}

      {gift && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-ink/60 backdrop-blur-sm">
          <div className="mx-auto grid min-h-full w-full max-w-xs place-items-center px-5 py-6 text-center">
            <div className="w-full">
              <Reveal key={gift.id} kind={gift.kind} data={gift.data} from={gift.from}>
                <button className="btn !text-lg" onClick={send}>Kabari {m.from}</button>
                <button className="btn btn-alt !text-lg" onClick={next}>{left.length ? "Lanjut capit" : "Lihat koleksi"}</button>
              </Reveal>
              <p role="status" className="min-h-5 pt-2 text-sm text-paper">{status}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
