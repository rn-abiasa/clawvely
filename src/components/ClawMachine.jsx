import { useEffect, useRef, useState } from "react";
import { CAPSULE_COLORS, RARITY } from "../lib/machine";

const INK = "#3A2822";
const REST = 388, LEFT = 108, RIGHT = 298, CHUTE = 64, RAIL = 132, DROP = 206;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tr = (t) => `transform ${t}ms ${t > 200 ? "ease-in-out" : "linear"}`;

function Capsule({ color, rot }) {
  return (
    <g transform={`rotate(${rot})`}>
      <circle r="20" fill={color} />
      <path d="M-20 0A20 20 0 0 1 20 0Z" fill="#FFF8E6" />
      <circle r="20" fill="none" stroke={INK} strokeWidth="3" />
      <path d="M-20 0H20" stroke={INK} strokeWidth="2.5" />
      <path d="M-11 -9q3-6 9-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

export default function ClawMachine({ name, prizes, play = false, onWin }) {
  const n = prizes.length;
  const home = prizes.map((_, i) => ({ x: n === 1 ? 203 : LEFT + (i * (RIGHT - LEFT)) / (n - 1), y: REST }));
  const [claw, setClaw] = useState({ x: 203, d: 0, t: 0, open: true });
  const [held, setHeld] = useState(null);
  const [msg, setMsg] = useState("");
  const busy = useRef(false);
  const timer = useRef();

  const stop = () => clearInterval(timer.current);
  const step = (dir) =>
    setClaw((c) => (busy.current ? c : { ...c, x: Math.min(RIGHT + 4, Math.max(LEFT - 8, c.x + dir * 6)), t: 80 }));
  const start = (dir) => {
    if (busy.current) return;
    stop();
    step(dir);
    timer.current = setInterval(() => step(dir), 70);
  };
  useEffect(() => stop, []);

  async function grab() {
    if (!play || busy.current) return;
    busy.current = true;
    stop();
    setMsg("");
    const cx = claw.x;
    setClaw({ x: cx, d: DROP, t: 900, open: true });
    await sleep(950);
    const hit = home
      .map((h, i) => ({ i, dx: Math.abs(h.x - cx) }))
      .filter((o) => o.dx < 19)
      .sort((a, b) => a.dx - b.dx)[0];
    setClaw({ x: cx, d: DROP, t: 300, open: false });
    await sleep(400);
    const rise = async (text) => {
      setClaw({ x: cx, d: 0, t: 900, open: false });
      await sleep(950);
      setClaw({ x: cx, d: 0, t: 0, open: true });
      setMsg(text);
      busy.current = false;
    };
    if (!hit) return rise("Kosong! Geser sedikit, coba lagi.");

    const i = hit.i;
    const hold = (x, d, t) => {
      setClaw({ x, d, t, open: false });
      setHeld({ i, x, y: RAIL + d + 50, t });
    };
    if (Math.random() > RARITY[prizes[i].r].grip) {
      hold(cx, 90, 600);
      await sleep(650);
      setHeld(null);
      return rise("Hampir dapat! Lepas di tengah jalan.");
    }
    hold(cx, 0, 900);
    await sleep(950);
    hold(CHUTE, 0, 1100);
    await sleep(1150);
    setClaw({ x: CHUTE, d: 0, t: 0, open: true });
    setHeld({ i, x: CHUTE, y: 446, t: 500 });
    await sleep(700);
    busy.current = false;
    onWin?.(prizes[i]);
  }

  const arm = (side) => ({
    transformOrigin: `${side * 9}px ${RAIL + 20}px`,
    transform: `rotate(${side * (claw.open ? -20 : 8)}deg)`,
    transition: "transform .3s",
  });
  const label = (name || "Mesin Hadiah").slice(0, 18);

  return (
    <div>
      <svg viewBox="0 0 360 500" className="mx-auto block w-full max-w-[380px]" role="img" aria-label={`Mesin capit ${label} berisi ${n} hadiah`}>
        <defs>
          <filter id="sketch" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="3.5" />
          </filter>
        </defs>
        <g filter="url(#sketch)" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
          <path className="cat-tail" d="M292 66q30-4 22-34" fill="none" stroke="#4A3B40" strokeWidth="9" />
          <ellipse cx="262" cy="58" rx="36" ry="20" fill="#4A3B40" />
          <path d="M222 36l4-20 12 10zM250 28l10-18 6 18z" fill="#4A3B40" />
          <circle cx="236" cy="44" r="18" fill="#4A3B40" />
          <path d="M226 52q10 10 20 0q-2 8-10 8t-10-8z" fill="#FFF8E6" strokeWidth="2" />
          <circle cx="230" cy="42" r="2.5" fill="#F7D774" stroke="none" />
          <circle cx="243" cy="42" r="2.5" fill="#F7D774" stroke="none" />
          <rect x="18" y="70" width="324" height="412" rx="28" fill="#EE6F5B" />
          <rect x="34" y="82" width="292" height="34" rx="14" fill="#FFF8E6" />
          <text x="180" y="107" textAnchor="middle" fontSize="26" fontWeight="700" fill={INK} stroke="none" style={{ fontFamily: "var(--font-display)" }}>{label}</text>
          <rect x="38" y="124" width="284" height="290" rx="16" fill="#FFF1C9" />
          <rect x="38" y="404" width="284" height="10" fill="#F0D9A0" />
          <rect x="46" y="126" width="268" height="8" rx="4" fill="#E9B9A8" strokeWidth="2.5" />
          <rect x="40" y="428" width="100" height="44" rx="10" fill="#5A3B33" />
          <rect x="190" y="434" width="64" height="26" rx="8" fill="#F7D774" />
          <circle cx="290" cy="447" r="12" fill="#A9D9BC" />
        </g>

        {prizes.map((p, i) => {
          const h = held?.i === i ? held : { ...home[i], t: 400 };
          return (
            <g key={i} style={{ transform: `translate(${h.x}px, ${h.y}px)`, transition: tr(h.t) }}>
              <Capsule color={CAPSULE_COLORS[i % 6]} rot={((i * 37) % 24) - 12} />
            </g>
          );
        })}

        <g style={{ transform: `translateX(${claw.x}px)`, transition: tr(claw.t) }}>
          <line x1="0" y1={RAIL} x2="0" y2={RAIL + 260} stroke={INK} strokeWidth="3" style={{ transformBox: "fill-box", transformOrigin: "top", transform: `scaleY(${(claw.d + 6) / 260})`, transition: tr(claw.t) }} />
          <g style={{ transform: `translateY(${claw.d}px)`, transition: tr(claw.t) }}>
            <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d={`M-9 ${RAIL + 20}l-8 22l8 20`} style={arm(-1)} />
              <path d={`M9 ${RAIL + 20}l8 22l-8 20`} style={arm(1)} />
            </g>
            <rect x="-14" y={RAIL + 4} width="28" height="18" rx="7" fill="#F7D774" stroke={INK} strokeWidth="3" />
          </g>
        </g>

        <path d="M50 134L118 134L62 300Z" fill="#fff" opacity=".28" />
      </svg>

      {play && (
        <>
          <p role="status" className="mt-3 min-h-8 text-center font-display text-xl font-bold">{msg}</p>
          <div className="mt-2 flex items-center justify-center gap-5">
            {[[-1, "Geser kiri", "◀"], [1, "Geser kanan", "▶"]].map(([dir, aria, ico]) => (
              <button
                key={dir}
                className="dir"
                aria-label={aria}
                onPointerDown={() => start(dir)}
                onPointerUp={stop}
                onPointerLeave={stop}
                onPointerCancel={stop}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), step(dir))}
              >
                {ico}
              </button>
            ))}
            <button className="btn" onClick={grab}>Capit!</button>
          </div>
        </>
      )}
    </div>
  );
}
