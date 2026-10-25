const INK = "#3A2822";

// Gambar benda 40x40; dipakai di nampan, chip, dan sebagai siluet di dalam bola.
export function IconShape({ kind }) {
  const s = { stroke: INK, strokeWidth: 2.2, strokeLinejoin: "round", strokeLinecap: "round" };
  if (kind === "message")
    return (
      <g {...s}>
        <rect x="5" y="10" width="30" height="21" rx="3" fill="#FFF8E6" />
        <path d="M5 12l15 12 15-12" fill="#F0C9B8" />
        <circle cx="20" cy="24" r="4.5" fill="#EE6F5B" />
      </g>
    );
  if (kind === "song")
    return (
      <g {...s}>
        <circle cx="20" cy="20" r="16" fill="#4A3B40" />
        <circle cx="20" cy="20" r="11" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".35" />
        <circle cx="20" cy="20" r="7" fill="none" stroke="#fff" strokeWidth="1.2" opacity=".35" />
        <circle cx="20" cy="20" r="4.5" fill="#F7D774" />
        <path d="M9 11a14 14 0 0 1 7-5" fill="none" stroke="#fff" strokeWidth="2" opacity=".6" />
      </g>
    );
  if (kind === "photo")
    return (
      <g {...s}>
        <rect x="7" y="5" width="26" height="30" rx="2" fill="#FFF8E6" />
        <rect x="10" y="8" width="20" height="19" fill="#A8CFEA" />
        <circle cx="24" cy="14" r="3" fill="#F7D774" strokeWidth="1.4" />
        <path d="M10 27l7-8 5 5 3-3 5 6z" fill="#A9D9BC" strokeWidth="1.6" />
      </g>
    );
  if (kind === "voucher")
    return (
      <g {...s}>
        <path d="M4 12h32v6a2.5 2.5 0 0 0 0 5v6H4v-6a2.5 2.5 0 0 0 0-5z" fill="#F7D774" />
        <path d="M14 13v15" strokeDasharray="2 3" fill="none" />
        <path d="M25 20l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.5-2.4 3.4-.5z" fill="#EE6F5B" strokeWidth="1.4" />
      </g>
    );
  return (
    <g {...s}>
      <rect x="8" y="5" width="24" height="30" fill="#FFF8E6" strokeDasharray="1.5 3" strokeWidth="3.2" />
      <rect x="12" y="9" width="16" height="16" fill="#F6A9A0" strokeWidth="1.6" />
      <path d="M20 22c-5-3-5-7-2-7 1.5 0 2 1 2 1s.5-1 2-1c3 0 3 4-2 7z" fill="#C93C58" strokeWidth="1.2" />
      <path d="M12 30h16" strokeWidth="2.4" />
    </g>
  );
}

export const GiftIcon = ({ kind, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <IconShape kind={kind} />
  </svg>
);

// Bola kapsul setengah transparan dengan siluet isi di dalamnya (radius 20).
export function Capsule({ color, rot = 0, kind }) {
  return (
    <g transform={`rotate(${rot})`}>
      <circle r="20" fill="#FFF8E6" />
      <path d="M-20 0a20 20 0 0 0 40 0z" fill={color} opacity=".6" />
      <g transform="translate(-11 -11) scale(.55)">
        <IconShape kind={kind} />
      </g>
      <circle r="20" fill="none" stroke={INK} strokeWidth="3" />
      <path d="M-12 -9q3-6 9-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}
