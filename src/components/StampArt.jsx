import { useId } from "react";
import { STAMPS } from "../lib/machine";

const PAPER = "#FBF0D4";

function Glyph({ icon, c }) {
  if (icon === "paw")
    return (
      <g fill={c}>
        <ellipse cx="50" cy="64" rx="20" ry="16" />
        <ellipse cx="25" cy="42" rx="8" ry="11" />
        <ellipse cx="41" cy="28" rx="8" ry="11" />
        <ellipse cx="59" cy="28" rx="8" ry="11" />
        <ellipse cx="75" cy="42" rx="8" ry="11" />
      </g>
    );
  if (icon === "heart") return <path d="M50 86C12 58 16 24 37 24c9 0 13 7 13 7s4-7 13-7c21 0 25 34-13 62z" fill={c} />;
  if (icon === "house")
    return (
      <g>
        <path d="M14 50L50 18l36 32" fill="none" stroke={c} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="26" y="48" width="48" height="38" fill={c} />
        <rect x="43" y="63" width="14" height="23" fill={PAPER} />
      </g>
    );
  if (icon === "moon")
    return (
      <g>
        <path d="M62 16a36 36 0 1 0 22 60A30 30 0 0 1 62 16z" fill={c} />
        <circle cx="76" cy="28" r="4" fill={PAPER} />
        <circle cx="84" cy="44" r="2.5" fill={PAPER} />
      </g>
    );
  if (icon === "sun")
    return (
      <g>
        <circle cx="50" cy="50" r="20" fill={c} />
        <g stroke={c} strokeWidth="6" strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="50" y1="12" x2="50" y2="22" transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
      </g>
    );
  if (icon === "flower")
    return (
      <g>
        <g fill={c}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="50" cy="28" rx="11" ry="17" transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="10" fill={PAPER} />
      </g>
    );
  if (icon === "star") return <path d="M50 12l12 26 28 3-21 19 6 28-25-14-25 14 6-28L10 41l28-3z" fill={c} />;
  return (
    <g>
      <path d="M12 46L90 14 68 84 49 60 30 72 34 52z" fill={c} />
      <path d="M90 14L49 60" stroke={PAPER} strokeWidth="3" />
    </g>
  );
}

// Prangko bergerigi: kertas krem, panel oval berwarna, pita judul, dan nominal.
export default function StampArt({ id, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const s = STAMPS.find((x) => x.id === id) ?? STAMPS[0];
  const holes = [];
  for (let i = 0; i < 10; i++) holes.push([10 + i * 20, 0], [10 + i * 20, 250], [0, 12.5 + i * 25], [200, 12.5 + i * 25]);
  const size = s.title.length > 12 ? 17 : 21;

  return (
    <svg viewBox="0 0 200 250" className={className} style={{ filter: "drop-shadow(3px 4px 0 rgba(58,40,34,.3))" }} role="img" aria-label={`Stamp ${s.title}`}>
      <defs>
        <mask id={uid}>
          <rect width="200" height="250" fill="#fff" />
          {holes.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6.5" fill="#000" />
          ))}
        </mask>
      </defs>
      <g mask={`url(#${uid})`}>
        <rect width="200" height="250" fill={PAPER} />
        <rect x="16" y="16" width="168" height="218" fill="none" stroke={s.main} strokeWidth="2.5" />
        <text x="26" y="43" fontSize="22" fontWeight="700" fill={s.main} style={{ fontFamily: "var(--font-display)" }}>{s.denom}</text>
        <text x="174" y="40" fontSize="10" textAnchor="end" fill={s.main} style={{ fontFamily: "var(--font-body)", fontWeight: 800 }}>Clawvely</text>
        <ellipse cx="100" cy="108" rx="62" ry="58" fill={s.sky} />
        <ellipse cx="100" cy="108" rx="56" ry="52" fill="none" stroke={PAPER} strokeWidth="3" opacity=".8" />
        <g transform="translate(55 63) scale(.9)">
          <Glyph icon={s.icon} c={s.main} />
        </g>
        <rect x="28" y="182" width="144" height="36" rx="6" fill={s.main} />
        <text x="100" y="206" fontSize={size} fontWeight="700" textAnchor="middle" fill={PAPER} style={{ fontFamily: "var(--font-display)" }}>{s.title}</text>
      </g>
    </svg>
  );
}
