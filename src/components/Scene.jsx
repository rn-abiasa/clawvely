const TILE = "rgba(58,40,34,.08)";

const Cloud = ({ className }) => (
  <svg viewBox="0 0 120 50" className={`absolute ${className}`} aria-hidden="true">
    <path d="M18 44a14 14 0 0 1 2-28 20 20 0 0 1 38-6 16 16 0 0 1 28 8 13 13 0 0 1 16 26z" fill="#fff" opacity=".92" />
  </svg>
);

// Satu adegan utuh: langit di balik tembok, bibir tembok putih, dinding ubin, trotoar, dan aspal.
export default function Scene() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[32%]" style={{ background: "linear-gradient(#9CC6E8, #D3E8F1)" }} />
      <Cloud className="top-[3%] left-[6%] w-28" />
      <Cloud className="top-[9%] right-[8%] w-24" />

      {/* dinding */}
      <div
        className="absolute inset-x-0 top-[26%] bottom-[11%] bg-[#F3E7C4]"
        style={{ backgroundImage: `linear-gradient(${TILE} 2px, transparent 2px), linear-gradient(90deg, ${TILE} 2px, transparent 2px)`, backgroundSize: "44px 44px" }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 48%, rgba(255,251,235,.8), transparent 72%)" }} />
        <div className="absolute inset-y-0 left-[6%] w-[14%] -skew-x-12 bg-white/20" />
        <div className="absolute inset-y-0 right-[8%] w-[10%] -skew-x-12 bg-ink/5" />
      </div>
      {/* bibir tembok */}
      <div className="absolute inset-x-0 top-[24%] h-[2.6%] min-h-3 bg-[#FFFDF5] shadow-[0_5px_0_rgba(58,40,34,.14)]" />

      {/* trotoar, tepi trotoar, aspal */}
      <div
        className="absolute inset-x-0 bottom-0 h-[11%] border-t-[10px] border-[#F4D26B] bg-[#E3D3AF]"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(58,40,34,.12) 2px, transparent 2px)", backgroundSize: "96px 100%" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-3 bg-[#7A6E68]" />
    </div>
  );
}
