import { useEffect, useRef, useState } from "react";
import { CAPSULE_COLORS } from "../lib/machine";
import { Capsule } from "./Icons";

const INK = "#3A2822";
const REST = 388,
  LEFT = 108,
  RIGHT = 298,
  CHUTE = 64,
  RAIL = 132,
  DROP = 206;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tr = (t) => `transform ${t}ms ${t > 200 ? "ease-in-out" : "linear"}`;

// prizes: [{ k: jenis, slot?: posisi asli }]; slots: jumlah posisi total (supaya bola lain tidak bergeser).
export default function ClawMachine({
  name,
  prizes,
  slots,
  play = false,
  fit = false,
  paused = false,
  onWin,
}) {
  const total = Math.max(slots ?? prizes.length, 1);
  const xAt = (s) =>
    total === 1 ? 203 : LEFT + (s * (RIGHT - LEFT)) / (total - 1);
  const home = prizes.map((p, i) => ({ x: xAt(p.slot ?? i), y: REST }));
  const [claw, setClaw] = useState({ x: 203, d: 0, t: 0, open: true });
  const [held, setHeld] = useState(null);
  const [msg, setMsg] = useState("");
  const busy = useRef(false);
  const timer = useRef();

  const stop = () => clearInterval(timer.current);
  const step = (dir) =>
    setClaw((c) =>
      busy.current
        ? c
        : {
            ...c,
            x: Math.min(RIGHT + 4, Math.max(LEFT - 8, c.x + dir * 6)),
            t: 80,
          },
    );
  const start = (dir) => {
    if (busy.current) return;
    stop();
    step(dir);
    timer.current = setInterval(() => step(dir), 70);
  };
  useEffect(() => stop, []);

  // Keyboard: panah kiri/kanan (atau A/D) tahan untuk geser; panah bawah, S, atau Spasi/Enter untuk capit.
  // Tanpa daftar dependensi sengaja, supaya grab() selalu membaca posisi capit terbaru.
  useEffect(() => {
    if (!play || paused) return;
    const typing = (t) =>
      /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName) || t?.isContentEditable;
    const down = (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || typing(e.target))
        return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") {
        e.preventDefault();
        start(-1);
      } else if (k === "arrowright" || k === "d") {
        e.preventDefault();
        start(1);
      } else if (k === "arrowdown" || k === "s") {
        e.preventDefault();
        grab();
      } else if (
        (k === " " || k === "enter") &&
        !/^(BUTTON|A)$/.test(e.target.tagName)
      ) {
        e.preventDefault();
        grab();
      }
    };
    const up = (e) => {
      if (["arrowleft", "arrowright", "a", "d"].includes(e.key.toLowerCase()))
        stop();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", stop);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", stop);
    };
  });

  async function grab() {
    if (!play || paused || busy.current) return;
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
    if (!hit) return rise("Missed! Nudge it a bit and try again.");

    const i = hit.i;
    const hold = (x, d, t) => {
      setClaw({ x, d, t, open: false });
      setHeld({ i, x, y: RAIL + d + 50, t });
    };
    if (Math.random() < 0.2) {
      hold(cx, 90, 600);
      await sleep(650);
      setHeld(null);
      return rise("So close! It slipped on the way up.");
    }
    hold(cx, 0, 900);
    await sleep(950);
    hold(CHUTE, 0, 1100);
    await sleep(1150);
    setClaw({ x: CHUTE, d: 0, t: 0, open: true });
    setHeld({ i, x: CHUTE, y: 446, t: 500 });
    await sleep(700);
    busy.current = false;
    await onWin?.(prizes[i]);
    setHeld(null); // bola yang sudah diambil dihapus dari daftar oleh halaman induk
  }

  const arm = (side) => ({
    transformOrigin: `${side * 9}px ${RAIL + 20}px`,
    transform: `rotate(${side * (claw.open ? -20 : 8)}deg)`,
    transition: "transform .3s",
  });
  const label = (name || "Clawvely Machine").slice(0, 18);

  return (
    <div className={fit ? "flex h-full min-h-0 flex-col" : ""}>
      <div className={fit ? "min-h-0 flex-1" : ""}>
        <svg
          viewBox="0 0 360 500"
          className={
            fit
              ? "mx-auto block h-full w-full drop-shadow-[0_8px_0_rgba(58,40,34,.12)]"
              : "mx-auto block w-full max-w-[380px]"
          }
          role="img"
          aria-label={`Claw machine ${label} with ${prizes.length} balls`}
        >
          <defs>
            <filter id="sketch" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.035"
                numOctaves="2"
                seed="4"
              />
              <feDisplacementMap in="SourceGraphic" scale="3.5" />
            </filter>
          </defs>
          <path
            className="cat-tail"
            d="M292 66q30-4 22-34"
            fill="none"
            stroke="#4A3B40"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <g
            filter="url(#sketch)"
            stroke={INK}
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <ellipse cx="262" cy="58" rx="36" ry="20" fill="#4A3B40" />
            <path
              d="M221 37L224 17L235 28ZM237 28L248 17L251 37Z"
              fill="#4A3B40"
            />
            <circle cx="236" cy="44" r="18" fill="#4A3B40" />
            <path
              d="M226 52q10 10 20 0q-2 8-10 8t-10-8z"
              fill="#FFF8E6"
              strokeWidth="2"
            />
          </g>
          <circle className="cat-eye" cx="230" cy="42" r="2.5" fill="#F7D774" />
          <circle className="cat-eye" cx="243" cy="42" r="2.5" fill="#F7D774" />
          <g
            filter="url(#sketch)"
            stroke={INK}
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <rect
              x="18"
              y="70"
              width="324"
              height="412"
              rx="28"
              fill="#EE6F5B"
            />
            <rect
              x="34"
              y="82"
              width="292"
              height="34"
              rx="14"
              fill="#FFF8E6"
            />
            <text
              x="180"
              y="107"
              textAnchor="middle"
              fontSize="26"
              fontWeight="700"
              fill={INK}
              stroke="none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {label}
            </text>
            <rect
              x="38"
              y="124"
              width="284"
              height="290"
              rx="16"
              fill="#FFF1C9"
            />
            <rect x="38" y="404" width="284" height="10" fill="#F0D9A0" />
            <rect
              x="46"
              y="126"
              width="268"
              height="8"
              rx="4"
              fill="#E9B9A8"
              strokeWidth="2.5"
            />
            <rect
              x="40"
              y="428"
              width="100"
              height="44"
              rx="10"
              fill="#5A3B33"
            />
            <rect
              x="190"
              y="434"
              width="64"
              height="26"
              rx="8"
              fill="#F7D774"
            />
            <circle cx="290" cy="447" r="12" fill="#A9D9BC" />
          </g>

          {prizes.map((p, i) => {
            const h = held?.i === i ? held : { ...home[i], t: 400 };
            return (
              <g
                key={p.id ?? i}
                style={{
                  transform: `translate(${h.x}px, ${h.y}px)`,
                  transition: tr(h.t),
                }}
              >
                <Capsule
                  color={CAPSULE_COLORS[(p.slot ?? i) % 6]}
                  rot={(((p.slot ?? i) * 37) % 24) - 12}
                  kind={p.k}
                />
              </g>
            );
          })}

          <g
            style={{
              transform: `translateX(${claw.x}px)`,
              transition: tr(claw.t),
            }}
          >
            <line
              x1="0"
              y1={RAIL}
              x2="0"
              y2={RAIL + 260}
              stroke={INK}
              strokeWidth="3"
              style={{
                transformBox: "fill-box",
                transformOrigin: "top",
                transform: `scaleY(${(claw.d + 6) / 260})`,
                transition: tr(claw.t),
              }}
            />
            <g
              style={{
                transform: `translateY(${claw.d}px)`,
                transition: tr(claw.t),
              }}
            >
              <g
                fill="none"
                stroke={INK}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={`M-9 ${RAIL + 20}l-8 22l8 20`} style={arm(-1)} />
                <path d={`M9 ${RAIL + 20}l8 22l-8 20`} style={arm(1)} />
              </g>
              <rect
                x="-14"
                y={RAIL + 4}
                width="28"
                height="18"
                rx="7"
                fill="#F7D774"
                stroke={INK}
                strokeWidth="3"
              />
            </g>
          </g>

          <path d="M50 134L118 134L62 300Z" fill="#fff" opacity=".28" />
        </svg>
      </div>

      {play && (
        <>
          <p
            role="status"
            className="mt-3 min-h-8 text-center font-display text-xl font-bold"
          >
            {msg}
          </p>
          <div className="mt-2 flex items-center justify-center gap-5">
            {[
              [-1, "Move left", "◀"],
              [1, "Move right", "▶"],
            ].map(([dir, aria, ico]) => (
              <button
                key={dir}
                className="dir"
                aria-label={aria}
                onPointerDown={() => start(dir)}
                onPointerUp={stop}
                onPointerLeave={stop}
                onPointerCancel={stop}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  (e.preventDefault(), step(dir))
                }
              >
                {ico}
              </button>
            ))}
            <button className="btn" onClick={grab}>
              Grab!
            </button>
          </div>
          <p className="mt-2 hidden text-center text-xs md:block">
            Keyboard: ← → to move, Space or ↓ to grab
          </p>
        </>
      )}
    </div>
  );
}
