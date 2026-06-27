import React from "react";

export interface BrandInfo {
  name: string;
  bg: string;
  text: string;
  label: string;
}

const BRANDS: { keywords: string[]; info: BrandInfo }[] = [
  {
    keywords: ["apple", "iphone", "ipad", "macbook", "airpods", "imac", "ipod", "apple watch"],
    info: { name: "Apple", bg: "#1d1d1f", text: "#ffffff", label: "" },
  },
  {
    keywords: ["samsung", "sumsung", "samsang", "samsng", "galaxy", "samsung galaxy", "samung"],
    info: { name: "Samsung", bg: "#1428A0", text: "#ffffff", label: "SAMSUNG" },
  },
  {
    keywords: ["oppo", "oppo reno", "oppo a", "oppo f", "oppo k"],
    info: { name: "Oppo", bg: "#1D6F42", text: "#ffffff", label: "OPPO" },
  },
  {
    keywords: ["redmi", "xiaomi", "mi ", "poco", "mi note", "mi pro"],
    info: { name: "Redmi", bg: "#FF6900", text: "#ffffff", label: "Redmi" },
  },
  {
    keywords: ["motorola", "moto g", "moto e", "moto x", "moto edge", "moto"],
    info: { name: "Moto", bg: "#003087", text: "#ffffff", label: "moto" },
  },
  {
    keywords: ["nokia"],
    info: { name: "Nokia", bg: "#005AFF", text: "#ffffff", label: "NOKIA" },
  },
  {
    keywords: ["vivo", "vivo y", "vivo v", "vivo x", "vivo t"],
    info: { name: "Vivo", bg: "#415FFF", text: "#ffffff", label: "vivo" },
  },
  {
    keywords: ["realme", "realme narzo"],
    info: { name: "Realme", bg: "#F5A623", text: "#ffffff", label: "realme" },
  },
  {
    keywords: ["oneplus", "one plus"],
    info: { name: "OnePlus", bg: "#F5010C", text: "#ffffff", label: "1+" },
  },
  {
    keywords: ["honor"],
    info: { name: "Honor", bg: "#C0392B", text: "#ffffff", label: "HONOR" },
  },
  {
    keywords: ["iqoo"],
    info: { name: "iQOO", bg: "#232323", text: "#ffffff", label: "iQOO" },
  },
  {
    keywords: ["infinix"],
    info: { name: "Infinix", bg: "#E31837", text: "#ffffff", label: "infinix" },
  },
  {
    keywords: ["tecno"],
    info: { name: "Tecno", bg: "#0066CC", text: "#ffffff", label: "TECNO" },
  },
  {
    keywords: ["itel"],
    info: { name: "itel", bg: "#008000", text: "#ffffff", label: "itel" },
  },
  {
    keywords: ["lava", "lava agni", "lava blaze"],
    info: { name: "Lava", bg: "#E05A00", text: "#ffffff", label: "LAVA" },
  },
  {
    keywords: ["htc"],
    info: { name: "HTC", bg: "#009900", text: "#ffffff", label: "HTC" },
  },
  {
    keywords: ["lg "],
    info: { name: "LG", bg: "#A50034", text: "#ffffff", label: "LG" },
  },
  {
    keywords: ["sony", "xperia"],
    info: { name: "Sony", bg: "#000000", text: "#ffffff", label: "SONY" },
  },
  {
    keywords: ["google pixel", "pixel"],
    info: { name: "Google", bg: "#4285F4", text: "#ffffff", label: "Pixel" },
  },
];

export function detectBrand(description: string): BrandInfo | null {
  if (!description) return null;
  const lower = description.toLowerCase();
  for (const brand of BRANDS) {
    if (brand.keywords.some((kw) => lower.includes(kw))) {
      return brand.info;
    }
  }
  return null;
}

interface BrandBadgeProps {
  description: string;
  size?: "sm" | "md";
}

export function BrandBadge({ description, size = "sm" }: BrandBadgeProps) {
  const brand = detectBrand(description);
  if (!brand) return null;

  const isApple = brand.name === "Apple";
  const fontSize = size === "sm" ? "9px" : "10px";
  const px = size === "sm" ? "5px" : "6px";
  const py = size === "sm" ? "1px" : "2px";

  return (
    <span
      style={{
        display: "inline-block",
        background: brand.bg,
        color: brand.text,
        fontSize,
        fontWeight: 700,
        padding: `${py} ${px}`,
        borderRadius: "3px",
        letterSpacing: "0.3px",
        verticalAlign: "middle",
        marginRight: "4px",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
      }}
    >
      {isApple ? "⌘ Apple" : brand.label}
    </span>
  );
}

export function BrandBadgeInline({ description }: { description: string }) {
  const brand = detectBrand(description);
  if (!brand) return null;
  const isApple = brand.name === "Apple";
  return (
    <span
      style={{
        display: "inline-block",
        background: brand.bg,
        color: brand.text,
        fontSize: "8px",
        fontWeight: 700,
        padding: "1px 4px",
        borderRadius: "2px",
        verticalAlign: "middle",
        marginRight: "3px",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {isApple ? "⌘ Apple" : brand.label}
    </span>
  );
}
