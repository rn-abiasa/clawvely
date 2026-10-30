import { useState } from "react";
import { Link } from "react-router-dom";
import { shareLink } from "../lib/machine";
import { GiftIcon } from "./Icons";

const COLORS = ["#EE6F5B", "#F7D774", "#A8CFEA", "#A9D9BC", "#C4A8E6", "#FFF8E6"];

// Layar selamat setelah bola terakhir dibuka: dirancang enak di-screenshot dan direkam.
export default function Congrats({ from, kinds, onAgain }) {
  const [status, setStatus] = useState("");
  const [bits] = useState(() =>
    Array.from({ length: 48 }, (_, i) => ({
      x: Math.random() * 100,
      w: 7 + Math.random() * 8,
      rot: 360 + Math.random() * 720,
      dur: 3.2 + Math.random() * 3,
      delay: -Math.random() * 6, // negatif: confetti sudah berjatuhan sejak awal
      c: COLORS[i % COLORS.length],
    })),
  );
  const date = new Date().toLocaleDateString("en-US", { dateStyle: "long" });
  const share = async () =>
    setStatus(
      await shareLink(
        location.origin,
        `I just opened ${kinds.length} ${kinds.length === 1 ? "surprise" : "surprises"} from ${from} in a Clawvely claw machine! Make your own:`,
      ),
    );

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto" style={{ background: "radial-gradient(circle at 50% 28%, #FBE7A1, #F4A28F 68%, #EE6F5B)" }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute top-[28%] left-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite]"
          style={{ background: "repeating-conic-gradient(rgba(255,248,230,.35) 0 7deg, transparent 7deg 14deg)", maskImage: "radial-gradient(circle, #000 0, transparent 40%)", WebkitMaskImage: "radial-gradient(circle, #000 0, transparent 40%)" }}
        />
        {bits.map((b, i) => (
          <span key={i} className="absolute top-0 animate-fall rounded-[2px]" style={{ left: `${b.x}%`, width: b.w, height: b.w * 0.55, background: b.c, "--rot": `${b.rot}deg`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-full max-w-sm flex-col items-center justify-center gap-6 px-5 py-8 text-center">
        <h1
          aria-label="Congrats!"
          className="font-display text-7xl leading-none font-bold text-paper"
          style={{ WebkitTextStroke: "3px #3A2822", paintOrder: "stroke fill", textShadow: "0 5px 0 #3A2822" }}
        >
          {[..."Congrats!"].map((ch, i) => (
            <span key={i} aria-hidden="true" className="inline-block animate-[hop_1.6s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.1}s` }}>
              {ch}
            </span>
          ))}
        </h1>

        <article className="relative w-full -rotate-1 animate-pop rounded-3xl border-[3px] border-ink bg-paper px-5 pt-7 pb-5 shadow-[6px_6px_0_var(--color-ink)]">
          <div aria-hidden="true" className="absolute -top-6 -right-4 grid h-20 w-20 animate-stamp place-items-center rounded-full border-4 border-double border-coral bg-paper text-center font-display text-lg leading-none font-bold text-coral" style={{ animationDelay: ".7s" }}>
            100%
            <br />
            opened
          </div>
          <p className="font-display text-2xl">{from} prepared</p>
          <p className="font-display text-5xl leading-none font-bold text-coral">{kinds.length} {kinds.length === 1 ? "surprise" : "surprises"}</p>
          <p className="font-display text-2xl">and you opened every single one</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {kinds.map((k, i) => (
              <li key={i} className="animate-pop rounded-2xl border-[2.5px] border-ink bg-wall p-1.5" style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
                <GiftIcon kind={k} size={40} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs">Played on Clawvely, {date}</p>
        </article>

        <div className="w-full space-y-3">
          <button className="btn w-full !bg-ink" onClick={share}>Share</button>
          <button className="btn btn-alt w-full" onClick={onAgain}>Play again</button>
          <Link className="btn btn-alt w-full" to="/">Create your own machine</Link>
          <p role="status" className="min-h-5 text-sm font-bold">{status}</p>
        </div>
      </div>
    </div>
  );
}
