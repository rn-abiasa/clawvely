export const CAPSULE_COLORS = ["#F29B93", "#9FC9E8", "#F5D27A", "#A9D9BC", "#C4A8E6", "#F4A874"];
// Prangko siap pakai (tulisan, warna, dan gambar sudah ditentukan).
export const STAMPS = [
  { id: "best-friend", title: "Best Friend", icon: "paw", denom: "10", sky: "#F7C65B", main: "#E8553F" },
  { id: "favorite-person", title: "Favorite Person", icon: "heart", denom: "01", sky: "#F6A9A0", main: "#C93C58" },
  { id: "my-home", title: "My Home", icon: "house", denom: "05", sky: "#9ED0C4", main: "#2D7466" },
  { id: "sweet-dreams", title: "Sweet Dreams", icon: "moon", denom: "22", sky: "#8FB4E3", main: "#2F5FA8" },
  { id: "my-sunshine", title: "My Sunshine", icon: "sun", denom: "08", sky: "#F9D56E", main: "#D9572B" },
  { id: "forever-yours", title: "Forever Yours", icon: "flower", denom: "99", sky: "#C9B3EA", main: "#6B49A8" },
  { id: "cutie-pie", title: "Cutie Pie", icon: "star", denom: "15", sky: "#F4B183", main: "#B8452B" },
  { id: "dekat-di-hati", title: "Dekat di Hati", icon: "plane", denom: "25", sky: "#A8D5EC", main: "#2C6E8F" },
];

export const KINDS = {
  message: { label: "Pesan", hint: "Surat dalam amplop" },
  song: { label: "Lagu", hint: "Piringan vinyl dari YouTube" },
  photo: { label: "Foto", hint: "Polaroid kenangan" },
  voucher: { label: "Voucher", hint: "Tiket hadiah, misalnya pulsa atau kuota" },
  stamp: { label: "Prangko", hint: "Prangko manis untuk dia" },
};

export const cleanId = (s = "") => s.trim().split(/\s+/)[0];

export const parseYouTube = (s = "") => {
  const t = s.trim();
  const m = t.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(t) ? t : null;
};

export const giftLabel = (kind, d = {}) =>
  ({ message: d.text, song: d.title || "Lagu", photo: d.caption || "Foto", voucher: d.title, stamp: STAMPS.find((s) => s.id === d.s)?.title })[kind] || "";

// Kecilkan foto di browser supaya ringan disimpan (sekitar 50-100 KB).
export function compressImage(file, max = 720, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * r);
      c.height = Math.round(img.height * r);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Foto tidak bisa dibaca"));
    img.src = url;
  });
}

export async function shareLink(url, text) {
  try {
    if (navigator.share) {
      await navigator.share({ text: `${text}\n${url}` });
      return "";
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return "Link disalin. Tempel ke chat dia.";
  } catch {
    return "";
  }
}
