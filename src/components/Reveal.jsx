import { useEffect, useState } from "react";
import { CAPSULE_COLORS } from "../lib/machine";
import GiftItem from "./GiftItem";
import { Capsule } from "./Icons";

const CONFETTI = ["#EE6F5B", "#F7D774", "#A8CFEA", "#A9D9BC", "#C4A8E6"];

// Panggung pembuka: bola muncul, pecah sendiri dengan confetti, lalu hadiah melayang di tengah sinar.
export default function Reveal({ kind, data, from, children }) {
  const [phase, setPhase] = useState(0); // 0 bola, 1 pecah, 2 hadiah
  const [bits] = useState(() =>
    Array.from({ length: 28 }, (_, i) => {
      const a = Math.random() * Math.PI * 2;
      const r = 90 + Math.random() * 150;
      return { dx: Math.cos(a) * r, dy: Math.sin(a) * r - 50, rot: Math.random() * 720 - 360, c: CONFETTI[i % 5], delay: Math.random() * 0.12, w: 6 + Math.random() * 8 };
    }),
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 450);
    const t2 = setTimeout(() => setPhase(2), 850);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute top-[40%] left-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 animate-[spin_50s_linear_infinite]"
          style={{
            background: "repeating-conic-gradient(rgba(247,215,116,.4) 0 7deg, transparent 7deg 14deg)",
            maskImage: "radial-gradient(circle, #000 0, transparent 35%)",
            WebkitMaskImage: "radial-gradient(circle, #000 0, transparent 35%)",
          }}
        />
      </div>

      <div className="relative flex min-h-[72dvh] flex-col items-center justify-center gap-6">
        {phase < 2 && (
          <svg viewBox="-26 -26 52 52" width="180" height="180" className={phase === 0 ? "animate-wiggle" : "animate-burst"} aria-hidden="true">
            <Capsule color={CAPSULE_COLORS[0]} kind={kind} />
          </svg>
        )}
        {phase >= 1 && (
          <div aria-hidden className="pointer-events-none absolute top-1/3 left-1/2">
            {bits.map((b, i) => (
              <span key={i} className="absolute animate-confetti rounded-[2px]" style={{ "--dx": `${b.dx}px`, "--dy": `${b.dy}px`, "--rot": `${b.rot}deg`, background: b.c, width: b.w, height: b.w * 0.55, animationDelay: `${b.delay}s` }} />
            ))}
          </div>
        )}

        {phase >= 2 && (
          <>
            <p className="-rotate-2 animate-pop rounded-lg border-[3px] border-ink bg-butter px-4 py-1 font-display text-2xl font-bold shadow-[3px_3px_0_var(--color-ink)]">
              Kejutan dari {from}
            </p>
            <div className={`w-full ${kind === "song" ? "" : "animate-float"}`}>
              <GiftItem kind={kind} data={data} from={from} />
            </div>
            <div className="flex flex-wrap justify-center gap-3">{children}</div>
          </>
        )}
      </div>
    </>
  );
}
