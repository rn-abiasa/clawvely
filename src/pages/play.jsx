import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ClawMachine from "../components/ClawMachine";
import Congrats from "../components/Congrats";
import Reveal from "../components/Reveal";
import Scene from "../components/Scene";
import { cleanId } from "../lib/machine";
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
  const [left, setLeft] = useState([]);
  const [opened, setOpened] = useState([]); // jenis hadiah yang sudah dibuka di putaran ini
  const [failed, setFailed] = useState(false);
  const [gift, setGift] = useState(null);
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    rpc("get_machine", { p_play_id: id })
      .then((r) => (r ? (setM(r), setLeft(r.prizes)) : setFailed(true)))
      .catch(() => setFailed(true));
  }, [id]);

  if (failed) return <Notice text="This machine link can't be opened"><Link className="btn" to="/">Create a new machine</Link></Notice>;
  if (!m) return <Notice text="Warming up the machine..." />;

  const win = async (p) => {
    try {
      const c = await rpc("reveal_prize", { p_play_id: id, p_prize_id: p.id });
      if (!c) throw new Error("Prize not found");
      setLeft((l) => l.filter((x) => x.id !== p.id)); // bola hilang di putaran ini
      setOpened((o) => [...o, c.kind]);
      setStatus("");
      setGift(c);
    } catch (e) {
      setStatus(e.message);
    }
  };
  const next = () => {
    setGift(null);
    if (left.length === 0) setDone(true);
    else setRound((r) => r + 1);
  };
  const again = () => {
    setLeft(m.prizes);
    setOpened([]);
    setDone(false);
    setGift(null);
    setRound((r) => r + 1);
  };

  return (
    <main className="relative flex h-dvh flex-col items-center overflow-hidden">
      <Scene />
      <header className="relative z-[1] w-full max-w-md px-4 pt-4 text-center">
        <p className="inline-block -rotate-1 rounded-full border-[3px] border-ink bg-paper px-4 py-1 font-display text-2xl font-bold shadow-[3px_3px_0_var(--color-ink)]">
          {m.from} prepared {m.total} {m.total === 1 ? "surprise" : "surprises"}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2" role="img" aria-label={`${left.length} balls left`}>
          {Array.from({ length: m.total }, (_, i) => (
            <span key={i} className={`h-3.5 w-3.5 rounded-full border-2 border-ink ${i < left.length ? "bg-butter" : "opacity-40"}`} />
          ))}
        </div>
      </header>

      <div className="relative z-[1] min-h-0 w-full max-w-md flex-1 px-3 pt-2 pb-4">
        <ClawMachine key={round} name={m.name} prizes={left} slots={m.total} play fit paused={!!gift || done} onWin={win} />
      </div>
      {!gift && status && <p role="alert" className="absolute right-0 bottom-1 left-0 z-[1] text-center font-bold text-coral">{status}</p>}

      {gift && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-ink/60 backdrop-blur-sm">
          <div className="mx-auto grid min-h-full w-full max-w-xs place-items-center px-5 py-6 text-center">
            <Reveal key={`${round}-${left.length}`} kind={gift.kind} data={gift.data} from={gift.from}>
              <button className="btn" onClick={next}>{left.length ? "Keep grabbing" : "Finish"}</button>
            </Reveal>
          </div>
        </div>
      )}

      {done && <Congrats from={m.from} kinds={opened} onAgain={again} />}
    </main>
  );
}
