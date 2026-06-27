import React from "react";

export interface BrandInfo {
  name: string;
  bg: string;
  text: string;
  label: string;
}

/* ── Inline SVG brand marks ─────────────────────────────────────────── */
function AppleSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function SamsungSvg() {
  return (
    <svg viewBox="0 0 60 16" width="38" height="10">
      <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="white" letterSpacing="0.5">SAMSUNG</text>
    </svg>
  );
}

function OppoSvg() {
  return (
    <svg viewBox="0 0 40 14" width="32" height="11">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="white">OPPO</text>
    </svg>
  );
}

function VivoSvg() {
  return (
    <svg viewBox="0 0 30 14" width="26" height="11">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="white" fontStyle="italic">vivo</text>
    </svg>
  );
}

function RedmiSvg() {
  return (
    <svg viewBox="0 0 42 14" width="34" height="11">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="white">Redmi</text>
    </svg>
  );
}

function MotorolaSvg() {
  return (
    <svg viewBox="0 0 22 22" width="18" height="18" fill="none">
      <circle cx="11" cy="11" r="10" stroke="white" strokeWidth="1.5" />
      <text x="11" y="15.5" textAnchor="middle" fontFamily="Arial" fontSize="11" fontWeight="900" fill="white">M</text>
    </svg>
  );
}

function NokiaSvg() {
  return (
    <svg viewBox="0 0 38 14" width="30" height="11">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="white">NOKIA</text>
    </svg>
  );
}

function RealmeSvg() {
  return (
    <svg viewBox="0 0 44 14" width="36" height="11">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="white">realme</text>
    </svg>
  );
}

function OnePlusSvg() {
  return (
    <svg viewBox="0 0 26 16" width="22" height="13">
      <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="900" fill="white">1+</text>
    </svg>
  );
}

function HonorSvg() {
  return (
    <svg viewBox="0 0 40 14" width="32" height="11">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="white">HONOR</text>
    </svg>
  );
}

function IqooSvg() {
  return (
    <svg viewBox="0 0 32 14" width="26" height="11">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="white">iQOO</text>
    </svg>
  );
}

function InfinixSvg() {
  return (
    <svg viewBox="0 0 44 14" width="36" height="11">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="white">infinix</text>
    </svg>
  );
}

/* ── Brand registry ─────────────────────────────────────────────────── */
const BRAND_REGISTRY: {
  keywords: string[];
  info: BrandInfo;
  Icon: React.FC;
}[] = [
  {
    keywords: ["apple", "iphone", "ipad", "macbook", "airpods", "imac", "ipod"],
    info: { name: "Apple", bg: "#1d1d1f", text: "#fff", label: "Apple" },
    Icon: AppleSvg,
  },
  {
    keywords: ["samsung", "sumsung", "samsang", "samsng", "galaxy", "samung"],
    info: { name: "Samsung", bg: "#1428A0", text: "#fff", label: "Samsung" },
    Icon: SamsungSvg,
  },
  {
    keywords: ["oppo", "oppo reno", "oppo a", "oppo f", "oppo k"],
    info: { name: "Oppo", bg: "#1D6F42", text: "#fff", label: "Oppo" },
    Icon: OppoSvg,
  },
  {
    keywords: ["redmi", "xiaomi", "mi ", "poco", "mi note", "mi pro"],
    info: { name: "Redmi", bg: "#FF6900", text: "#fff", label: "Redmi" },
    Icon: RedmiSvg,
  },
  {
    keywords: ["motorola", "moto g", "moto e", "moto x", "moto edge", "moto"],
    info: { name: "Motorola", bg: "#003087", text: "#fff", label: "Moto" },
    Icon: MotorolaSvg,
  },
  {
    keywords: ["nokia"],
    info: { name: "Nokia", bg: "#005AFF", text: "#fff", label: "Nokia" },
    Icon: NokiaSvg,
  },
  {
    keywords: ["vivo", "vivo y", "vivo v", "vivo x", "vivo t"],
    info: { name: "Vivo", bg: "#415FFF", text: "#fff", label: "Vivo" },
    Icon: VivoSvg,
  },
  {
    keywords: ["realme", "realme narzo"],
    info: { name: "Realme", bg: "#F5A623", text: "#fff", label: "Realme" },
    Icon: RealmeSvg,
  },
  {
    keywords: ["oneplus", "one plus"],
    info: { name: "OnePlus", bg: "#F5010C", text: "#fff", label: "OnePlus" },
    Icon: OnePlusSvg,
  },
  {
    keywords: ["honor"],
    info: { name: "Honor", bg: "#C0392B", text: "#fff", label: "Honor" },
    Icon: HonorSvg,
  },
  {
    keywords: ["iqoo"],
    info: { name: "iQOO", bg: "#232323", text: "#fff", label: "iQOO" },
    Icon: IqooSvg,
  },
  {
    keywords: ["infinix"],
    info: { name: "Infinix", bg: "#E31837", text: "#fff", label: "Infinix" },
    Icon: InfinixSvg,
  },
];

const DEALER_BRANDS = BRAND_REGISTRY.slice(0, 12);

/* ── Detection ──────────────────────────────────────────────────────── */
export function detectBrand(description: string) {
  if (!description) return null;
  const lower = description.toLowerCase();
  for (const b of BRAND_REGISTRY) {
    if (b.keywords.some((kw) => lower.includes(kw))) return b;
  }
  return null;
}

/* ── "We Deal In" Banner ────────────────────────────────────────────── */
export function BrandDealerBanner() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        alignItems: "center",
        padding: "5px 8px",
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
      {DEALER_BRANDS.map(({ info, Icon }) => (
        <div
          key={info.name}
          title={info.name}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}
        >
          <div
            style={{
              background: info.bg,
              borderRadius: "5px",
              width: "32px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "2px 3px",
            }}
          >
            <Icon />
          </div>
          <span style={{ fontSize: "6px", color: "#444", whiteSpace: "nowrap" }}>{info.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Per-item badge (inline with product name) ──────────────────────── */
export function BrandBadge({ description }: { description: string }) {
  const match = detectBrand(description);
  if (!match) return null;
  const { info, Icon } = match;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: info.bg,
        borderRadius: "4px",
        padding: "2px 4px",
        verticalAlign: "middle",
        marginRight: "5px",
        height: "18px",
        minWidth: "22px",
        overflow: "hidden",
      }}
    >
      <Icon />
    </span>
  );
}

export function BrandBadgeInline({ description }: { description: string }) {
  const match = detectBrand(description);
  if (!match) return null;
  const { info, Icon } = match;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: info.bg,
        borderRadius: "3px",
        padding: "1px 3px",
        verticalAlign: "middle",
        marginRight: "4px",
        height: "16px",
        minWidth: "20px",
        overflow: "hidden",
      }}
    >
      <Icon />
    </span>
  );
}
