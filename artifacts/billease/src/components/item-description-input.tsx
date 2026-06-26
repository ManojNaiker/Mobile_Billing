import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = value.trim().length === 0
    ? products
    : products.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 260),
        zIndex: 9999,
      });
    }
  };

  const handleFocus = () => {
    updateDropdownPosition();
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    updateDropdownPosition();
    setOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => updateDropdownPosition();
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open]);

  return (
    <div className={cn(className)}>
      <Input
        ref={inputRef}
        className="h-9"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
      {open && filtered.length > 0 && createPortal(
        <div
          style={dropdownStyle}
          className="bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
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
        </div>,
        document.body
      )}
    </div>
  );
}
