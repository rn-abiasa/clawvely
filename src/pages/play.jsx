import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ClawMachine from "../components/ClawMachine";
import PrizeCard from "../components/PrizeCard";
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
  const [m, setM] = useState(null);
  const [failed, setFailed] = useState(false);
  const [wins, setWins] = useState(0);
  const [round, setRound] = useState(0);
  const [card, setCard] = useState(null);
  const [status, setStatus] = useState("");
  const wonKey = `clawvely:won:${id}`;

  useEffect(() => {
    rpc("get_machine", { p_play_id: id })
      .then((r) => (r ? (setM(r), setWins(r.wins)) : setFailed(true)))
      .catch(() => setFailed(true));
  }, [id]);

  if (failed) return <Notice text="Link mesin ini tidak bisa dibuka"><Link className="btn" to="/">Buat mesin baru</Link></Notice>;
  if (!m) return <Notice text="Menyalakan mesin..." />;

  const left = m.max_wins - wins;
  if (left <= 0 && !card) {
    let mine = null;
    try { mine = localStorage.getItem(wonKey); } catch { /* abaikan */ }
    return (
      <Notice text="Semua hadiah di mesin ini sudah diambil">
        {mine && <Link className="btn" to={`/c/${mine}`}>Lihat kartu hadiahmu</Link>}
      </Notice>
    );
  }

  const win = async (p) => {
    try {
      const c = await rpc("claim_prize", { p_play_id: id, p_prize_id: p.id });
      try { localStorage.setItem(wonKey, c.id); } catch { /* abaikan */ }
      setWins((w) => w + 1);
      setCard(c);
    } catch (e) {
      setStatus(e.message);
    }
  };
  const send = async () =>
    setStatus(await shareLink(`${location.origin}/c/${card.id}`, `Aku menang "${card.t}" dari mesin capitmu! Tebus ya.`));
  const again = () => { setCard(null); setStatus(""); setRound((r) => r + 1); };

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <h1 className="font-display text-4xl leading-tight font-bold">{m.from} menyiapkan {m.prizes.length} hadiah buat kamu</h1>
      <p className="mb-4">Geser capitnya, lalu tekan Capit! Jatah menang: {left}.</p>
      <ClawMachine key={round} name={m.name} prizes={m.prizes} play onWin={win} />
      {!card && status && <p role="alert" className="mt-2 text-center font-bold text-coral">{status}</p>}

      {card && (
        <div className="fixed inset-0 z-10 grid place-items-center overflow-y-auto bg-ink/60 p-5">
          <div className="w-full max-w-xs animate-pop space-y-4 text-center">
            <p className="font-display text-3xl font-bold text-paper">Kamu dapat hadiah!</p>
            <PrizeCard card={{ ...card, id: card.code }} />
            <div className="flex flex-col gap-3">
              <button className="btn" onClick={send}>Kirim bukti ke {m.from}</button>
              {left > 0 && <button className="btn btn-alt" onClick={again}>Main lagi</button>}
            </div>
            <p role="status" className="min-h-5 text-sm text-paper">{status}</p>
          </div>
        </div>
      )}
    </main>
  );
}
