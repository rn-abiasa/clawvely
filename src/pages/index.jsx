import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ClawMachine from "../components/ClawMachine";
import { GiftIcon } from "../components/Icons";
import PrizeEditor from "../components/PrizeEditor";
import { KINDS, giftLabel } from "../lib/machine";
import { rpc } from "../lib/supabase";

const MAX = 6;

export default function Index() {
  const [name, setName] = useState("Clawvely Machine");
  const [from, setFrom] = useState("");
  const [prizes, setPrizes] = useState([]);
  const [editing, setEditing] = useState(null); // { i: index | null, prize }
  const [ghost, setGhost] = useState(null);
  const [made, setMade] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const glass = useRef(null);
  const drag = useRef(null);
  const count = useRef(0);
  count.current = prizes.length;

  const addKind = (kind) => {
    if (count.current >= MAX) return setErr(`Maximum ${MAX} balls.`);
    setErr("");
    setEditing({ i: null, prize: { k: kind, d: {} } });
  };

  // Seret benda dari nampan ke mesin; ketuk biasa juga menambah (untuk layar sentuh).
  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 8)
        d.moved = true;
      setGhost({ kind: d.kind, x: e.clientX, y: e.clientY, show: d.moved });
    };
    const up = (e) => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      setGhost(null);
      const r = glass.current?.getBoundingClientRect();
      const inside =
        r &&
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      if (!d.moved || inside) addKind(d.kind);
    };
    const cancel = () => {
      drag.current = null;
      setGhost(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
  }, []);

  const save = (prize) => {
    setPrizes((ps) =>
      editing.i === null
        ? [...ps, prize]
        : ps.map((p, j) => (j === editing.i ? prize : p)),
    );
    setEditing(null);
  };
  const remove = (i) => {
    setPrizes((ps) => ps.filter((_, j) => j !== i));
    setEditing(null);
  };

  const ready = from.trim() && prizes.length >= 1;
  const make = async () => {
    setBusy(true);
    setErr("");
    try {
      const r = await rpc("create_machine", {
        p_name: name.trim() || "Clawvely Machine",
        p_from: from.trim(),
        p_prizes: prizes.map(({ k, d }) => ({ k, d })),
      });
      setMade(r);
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  };
  const copy = async (key, url) => {
    await navigator.clipboard.writeText(url);
    setCopied(key);
  };
  const playUrl = made && `${location.origin}/m/${made.play_id}`;

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="font-display text-5xl font-bold">Clawvely</h1>
      <p className="mb-6 text-lg">
        Fill the machine with surprises, send it to them, and let them do the grabbing.
      </p>
      <div className="md:grid md:grid-cols-2 md:items-start md:gap-10">
        <section className="md:sticky md:top-8">
          <div ref={glass}>
            <ClawMachine
              name={name}
              prizes={prizes}
              slots={Math.max(prizes.length, 1)}
            />
          </div>

          <p className="mt-4 mb-2 font-bold">
            Drag into the machine, or tap
          </p>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(KINDS).map(([k, v]) => (
              <button
                key={k}
                type="button"
                style={{ touchAction: "none" }}
                className="flex cursor-grab flex-col items-center gap-1 rounded-2xl border-[2.5px] border-ink bg-paper px-1 py-2 text-xs font-bold shadow-[2px_2px_0_var(--color-ink)] transition-transform select-none hover:-rotate-3 hover:scale-105"
                onPointerDown={(e) => {
                  drag.current = {
                    kind: k,
                    sx: e.clientX,
                    sy: e.clientY,
                    moved: false,
                  };
                  setGhost({
                    kind: k,
                    x: e.clientX,
                    y: e.clientY,
                    show: false,
                  });
                }}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  (e.preventDefault(), addKind(k))
                }
              >
                <GiftIcon kind={k} size={52} />
                {v.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-5 md:mt-0">
          <label className="block">
            <span className="font-bold">Machine name</span>
            <input
              className="field mt-1"
              value={name}
              maxLength={18}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="font-bold">Your name</span>
            <input
              className="field mt-1"
              value={from}
              maxLength={20}
              placeholder="So they know who it's from"
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>

          <div>
            <p className="mb-2 font-bold">
              Machine contents ({prizes.length}/{MAX})
            </p>
            {prizes.length === 0 && (
              <p className="text-sm">
                No balls yet. Drag an item from the tray into the machine.
              </p>
            )}
            <ul className="space-y-2">
              {prizes.map((p, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-2xl border-[2.5px] border-ink bg-paper px-3 py-2 text-left shadow-[2px_2px_0_var(--color-ink)]"
                    onClick={() => setEditing({ i, prize: p })}
                  >
                    <GiftIcon kind={p.k} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold">
                        {KINDS[p.k].label}
                      </span>
                      <span className="block truncate text-sm">
                        {giftLabel(p.k, p.d)}
                      </span>
                    </span>
                    <span className="text-sm underline">Edit</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn" disabled={!ready || busy} onClick={make}>
            {busy ? "Creating machine..." : "Create machine"}
          </button>
          {err && (
            <p role="alert" className="font-bold text-coral">
              {err}
            </p>
          )}

          {made && (
            <div className="space-y-4 rounded-2xl border-[2.5px] border-ink bg-paper p-4">
              <p className="font-bold">Your machine is ready. Send this link to them:</p>
              <p className="rounded-lg bg-wall p-2 text-xs break-all">{playUrl}</p>
              <p className="text-sm">The link can be opened and played as many times as they like.</p>
              <div className="flex flex-wrap gap-3">
                <button className="btn !text-xl" onClick={() => copy("play", playUrl)}>
                  {copied === "play" ? "Copied" : "Copy link"}
                </button>
                <Link className="btn btn-alt !text-xl" to={`/m/${made.play_id}`}>
                  Try it first
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      {ghost?.show && (
        <div
          className="pointer-events-none fixed z-40"
          style={{ left: ghost.x - 24, top: ghost.y - 24 }}
        >
          <GiftIcon kind={ghost.kind} size={48} />
        </div>
      )}

      {editing && (
        <PrizeEditor
          prize={editing.prize}
          isNew={editing.i === null}
          onSave={save}
          onDelete={() => remove(editing.i)}
          onCancel={() => setEditing(null)}
        />
      )}
    </main>
  );
}
