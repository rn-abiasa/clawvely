import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import bgm from "../assets/sounds/Relax (Lofi).mp4";

const KEY = "clawvely:sound";
const readOn = () => {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
};

// Layout induk: musik tetap jalan saat pindah halaman.
export default function Layout() {
  const audio = useRef(null);
  const [on, setOn] = useState(readOn);

  useEffect(() => {
    const a = new Audio(bgm);
    a.loop = true;
    a.volume = 0.3;
    audio.current = a;
    return () => a.pause();
  }, []);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    if (!on) {
      a.pause();
      return;
    }
    // Browser memblokir autoplay, jadi coba lagi di sentuhan/tombol pertama.
    const go = () => a.play().catch(() => {});
    go();
    window.addEventListener("pointerdown", go, { once: true });
    window.addEventListener("keydown", go, { once: true });
    return () => {
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("keydown", go);
    };
  }, [on]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      /* abaikan */
    }
  };

  return (
    <>
      <button
        className="dir fixed bottom-3 right-3 z-20 !h-11 !w-11"
        aria-label={on ? "Matikan musik" : "Nyalakan musik"}
        aria-pressed={on}
        onClick={toggle}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3A2822"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="#FFF8E6" />
          {on ? (
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
          ) : (
            <path d="M17 9l5 6M22 9l-5 6" />
          )}
        </svg>
      </button>
      <Outlet />
    </>
  );
}
