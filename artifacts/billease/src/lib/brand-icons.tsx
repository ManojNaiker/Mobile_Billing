import React from "react";
import {
  siSamsung,
  siApple,
  siOppo,
  siXiaomi,
  siMotorola,
  siNokia,
  siOneplus,
  siHuawei,
  siHonor,
  siGoogle,
  siSony,
  siLg,
  siVivo,
  siLenovo,
  siAcer,
  siAsus,
  siHtc,
} from "simple-icons";

export interface BrandInfo {
  name: string;
  bg: string;
  text: string;
  label: string;
}

/* ── Helper: render a simple-icons SVG path ─────────────────────────── */
function SiIcon({ icon, size = 16, color = "#fff" }: { icon: { path: string; hex: string }; size?: number; color?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={icon.path} />
    </svg>
  );
}

/* ── Fallback text mark for brands not in simple-icons ─────────────── */
function TextMark({ label, color = "#fff", size = 11 }: { label: string; color?: string; size?: number }) {
  return (
    <svg viewBox={`0 0 ${label.length * 7.5} 14`} width={label.length * 6} height={11}>
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize={size} fontWeight="700" fill={color}>
        {label}
      </text>
    </svg>
  );
}

/* ── Brand registry ─────────────────────────────────────────────────── */
interface BrandEntry {
  keywords: string[];
  name: string;
  label: string;
  bg: string;
  iconBg: string;
  renderIcon: (size?: number) => React.ReactNode;
}

const BRAND_REGISTRY: BrandEntry[] = [
  {
    keywords: ["apple", "iphone", "ipad", "macbook", "airpods", "imac", "ipod"],
    name: "Apple", label: "Apple", bg: "#1d1d1f", iconBg: "#1d1d1f",
    renderIcon: (s = 16) => <SiIcon icon={siApple} size={s} color="#fff" />,
  },
  {
    keywords: ["samsung", "sumsung", "samsang", "samsng", "galaxy", "samung"],
    name: "Samsung", label: "Samsung", bg: "#1428A0", iconBg: "#1428A0",
    renderIcon: (s = 16) => <SiIcon icon={siSamsung} size={s} color="#fff" />,
  },
  {
    keywords: ["oppo", "oppo reno", "oppo a", "oppo f", "oppo k"],
    name: "Oppo", label: "Oppo", bg: "#1D6F42", iconBg: "#1D6F42",
    renderIcon: (s = 16) => <SiIcon icon={siOppo} size={s} color="#fff" />,
  },
  {
    keywords: ["redmi", "xiaomi", "mi ", "poco", "mi note", "mi pro"],
    name: "Redmi", label: "Redmi", bg: "#FF6900", iconBg: "#FF6900",
    renderIcon: (s = 16) => <SiIcon icon={siXiaomi} size={s} color="#fff" />,
  },
  {
    keywords: ["motorola", "moto g", "moto e", "moto x", "moto edge", "moto"],
    name: "Motorola", label: "Moto", bg: "#E1140A", iconBg: "#E1140A",
    renderIcon: (s = 16) => <SiIcon icon={siMotorola} size={s} color="#fff" />,
  },
  {
    keywords: ["nokia"],
    name: "Nokia", label: "Nokia", bg: "#005AFF", iconBg: "#005AFF",
    renderIcon: (s = 16) => <SiIcon icon={siNokia} size={s} color="#fff" />,
  },
  {
    keywords: ["vivo", "vivo y", "vivo v", "vivo x", "vivo t"],
    name: "Vivo", label: "Vivo", bg: "#415FFF", iconBg: "#415FFF",
    renderIcon: (s = 16) => <SiIcon icon={siVivo} size={s} color="#fff" />,
  },
  {
    keywords: ["realme", "realme narzo"],
    name: "Realme", label: "Realme", bg: "#F5A623", iconBg: "#F5A623",
    renderIcon: () => <TextMark label="realme" color="#fff" size={10} />,
  },
  {
    keywords: ["oneplus", "one plus"],
    name: "OnePlus", label: "OnePlus", bg: "#F5010C", iconBg: "#F5010C",
    renderIcon: (s = 16) => <SiIcon icon={siOneplus} size={s} color="#fff" />,
  },
  {
    keywords: ["honor"],
    name: "Honor", label: "Honor", bg: "#1a1a2e", iconBg: "#1a1a2e",
    renderIcon: (s = 16) => <SiIcon icon={siHonor} size={s} color="#fff" />,
  },
  {
    keywords: ["iqoo"],
    name: "iQOO", label: "iQOO", bg: "#232323", iconBg: "#232323",
    renderIcon: () => <TextMark label="iQOO" color="#fff" size={11} />,
  },
  {
    keywords: ["infinix"],
    name: "Infinix", label: "Infinix", bg: "#E31837", iconBg: "#E31837",
    renderIcon: () => <TextMark label="infinix" color="#fff" size={9} />,
  },
  {
    keywords: ["huawei"],
    name: "Huawei", label: "Huawei", bg: "#CF0A2C", iconBg: "#CF0A2C",
    renderIcon: (s = 16) => <SiIcon icon={siHuawei} size={s} color="#fff" />,
  },
  {
    keywords: ["google pixel", "pixel"],
    name: "Google", label: "Pixel", bg: "#4285F4", iconBg: "#4285F4",
    renderIcon: (s = 16) => <SiIcon icon={siGoogle} size={s} color="#fff" />,
  },
  {
    keywords: ["sony", "xperia"],
    name: "Sony", label: "Sony", bg: "#000000", iconBg: "#000000",
    renderIcon: (s = 16) => <SiIcon icon={siSony} size={s} color="#fff" />,
  },
  {
    keywords: ["lg "],
    name: "LG", label: "LG", bg: "#A50034", iconBg: "#A50034",
    renderIcon: (s = 16) => <SiIcon icon={siLg} size={s} color="#fff" />,
  },
  {
    keywords: ["lenovo"],
    name: "Lenovo", label: "Lenovo", bg: "#E2231A", iconBg: "#E2231A",
    renderIcon: (s = 16) => <SiIcon icon={siLenovo} size={s} color="#fff" />,
  },
  {
    keywords: ["asus"],
    name: "Asus", label: "Asus", bg: "#1A1A1A", iconBg: "#1A1A1A",
    renderIcon: (s = 16) => <SiIcon icon={siAsus} size={s} color="#fff" />,
  },
  {
    keywords: ["htc"],
    name: "HTC", label: "HTC", bg: "#5EA417", iconBg: "#5EA417",
    renderIcon: (s = 16) => <SiIcon icon={siHtc} size={s} color="#fff" />,
  },
  {
    keywords: ["acer"],
    name: "Acer", label: "Acer", bg: "#83B81A", iconBg: "#83B81A",
    renderIcon: (s = 16) => <SiIcon icon={siAcer} size={s} color="#fff" />,
  },
];

/* ── Brands shown in the "We Deal In" banner ────────────────────────── */
const DEALER_BRANDS = BRAND_REGISTRY.filter(b =>
  ["Apple","Samsung","Oppo","Redmi","Motorola","Nokia","Vivo","Realme","OnePlus","Honor","iQOO","Infinix"].includes(b.name)
);

/* ── Detection helper ────────────────────────────────────────────────── */
export function detectBrand(description: string): BrandEntry | null {
  if (!description) return null;
  const lower = description.toLowerCase();
  for (const b of BRAND_REGISTRY) {
    if (b.keywords.some((kw) => lower.includes(kw))) return b;
  }
  return null;
}

/* ── "We Deal In" Banner ─────────────────────────────────────────────── */
export function BrandDealerBanner() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        alignItems: "center",
        padding: "6px 8px",
        background: "#f2f2f2",
        borderTop: "1px solid #ccc",
        borderBottom: "1px solid #ccc",
      }}
    >
      <span
        style={{
          fontSize: "8px",
          fontWeight: 700,
          color: "#555",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginRight: "2px",
          whiteSpace: "nowrap",
        }}
      >
        We Deal In:
      </span>
      {DEALER_BRANDS.map((b) => (
        <div
          key={b.name}
          title={b.name}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}
        >
          <div
            style={{
              background: b.iconBg,
              borderRadius: "6px",
              width: "30px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "3px",
            }}
          >
            {b.renderIcon(16)}
          </div>
          <span style={{ fontSize: "6px", color: "#444", whiteSpace: "nowrap", lineHeight: 1 }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Per-item badge (inline with product name) ──────────────────────── */
export function BrandBadge({ description }: { description: string }) {
  const b = detectBrand(description);
  if (!b) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: b.iconBg,
        borderRadius: "4px",
        padding: "2px 4px",
        verticalAlign: "middle",
        marginRight: "5px",
        height: "18px",
        minWidth: "24px",
        overflow: "hidden",
      }}
    >
      {b.renderIcon(13)}
    </span>
  );
}

export function BrandBadgeInline({ description }: { description: string }) {
  const b = detectBrand(description);
  if (!b) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: b.iconBg,
        borderRadius: "3px",
        padding: "1px 3px",
        verticalAlign: "middle",
        marginRight: "4px",
        height: "16px",
        minWidth: "20px",
        overflow: "hidden",
      }}
    >
      {b.renderIcon(12)}
    </span>
  );
}
