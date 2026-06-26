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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
    setActiveIndex(-1);
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    updateDropdownPosition();
    setActiveIndex(-1);
    setOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => { setOpen(false); setActiveIndex(-1); }, 150);
  };

  const handleSelect = (product: Product) => {
    onProductSelect(product);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (open && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(filtered[activeIndex]);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
        return;
      }
    }
    onKeyDown?.(e);
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

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
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && filtered.length > 0 && createPortal(
        <div
          ref={listRef}
          style={dropdownStyle}
          className="bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {filtered.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={cn(
                "w-full text-left px-3 py-2 text-sm cursor-pointer flex justify-between items-center gap-2",
                i === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(p);
              }}
              onMouseEnter={() => setActiveIndex(i)}
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
