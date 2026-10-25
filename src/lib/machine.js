// Data mesin & kartu dikodekan ke URL, jadi prototipe jalan tanpa backend/login.
export const RARITY = {
  biasa: { label: "Biasa", grip: 0.85 },
  langka: { label: "Langka", grip: 0.62 },
  legendaris: { label: "Legendaris", grip: 0.4 },
};
export const RARITY_ORDER = ["biasa", "langka", "legendaris"];
export const CAPSULE_COLORS = ["#F29B93", "#9FC9E8", "#F5D27A", "#A9D9BC", "#C4A8E6", "#F4A874"];

export const enc = (obj) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export const dec = (str = "") => {
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch {
    return null;
  }
};

export async function shareLink(url, text) {
  try {
    if (navigator.share) {
      await navigator.share({ text, url });
      return "";
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    return "Link disalin. Tempel ke chat dia.";
  } catch {
    return "";
  }
}
