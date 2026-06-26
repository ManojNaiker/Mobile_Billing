import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { INDIAN_STATES } from "@/lib/indian-utils";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface StateComboboxProps {
  value?: string | null;
  onSelect: (code: string, name: string) => void;
  placeholder?: string;
  className?: string;
}

export function StateCombobox({ value, onSelect, placeholder = "Type state name...", className }: StateComboboxProps) {
  const selectedState = INDIAN_STATES.find(s => s.code === value);
  const [query, setQuery] = useState(selectedState?.name ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = INDIAN_STATES.find(s => s.code === value);
    setQuery(state?.name ?? "");
  }, [value]);

  const filtered = query.trim().length === 0
    ? INDIAN_STATES
    : INDIAN_STATES.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase())
      );

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  };

  const handleFocus = () => {
    updateDropdownPosition();
    setActiveIndex(-1);
    setOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false);
      const state = INDIAN_STATES.find(s => s.code === value);
      setQuery(state?.name ?? "");
      setActiveIndex(-1);
    }, 150);
  };

  const handleSelect = (code: string, name: string) => {
    onSelect(code, name);
    setQuery(name);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        updateDropdownPosition();
        setOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex].code, filtered[activeIndex].name);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
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
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          className="pl-8"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); updateDropdownPosition(); setOpen(true); setActiveIndex(-1); }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>

      {open && filtered.length > 0 && createPortal(
        <div
          ref={listRef}
          style={dropdownStyle}
          className="bg-popover border border-border rounded-md shadow-lg max-h-52 overflow-y-auto"
        >
          {filtered.map((state, i) => (
            <button
              key={state.code}
              type="button"
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm cursor-pointer",
                i === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
                state.code === value && i !== activeIndex && "font-semibold"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(state.code, state.name);
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {state.name}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
