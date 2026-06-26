import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  hsn_sac?: string | null;
  unit: string;
  rate: number;
  tax_percent: number;
}

interface ItemDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
  products: Product[];
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function ItemDescriptionInput({
  value,
  onChange,
  onProductSelect,
  products,
  onKeyDown,
  placeholder = "Description",
  className,
}: ItemDescriptionInputProps) {
  const [open, setOpen] = useState(false);

  const filtered = value.trim().length === 0
    ? products
    : products.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        className="h-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 left-0 top-full mt-1 w-72 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer flex justify-between items-center gap-2"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(p);
              }}
            >
              <span className="truncate">{p.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">₹{p.rate}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
