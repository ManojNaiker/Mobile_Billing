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
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLInputElement>(null);

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
    setOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false);
      const state = INDIAN_STATES.find(s => s.code === value);
      setQuery(state?.name ?? "");
    }, 150);
  };

  const handleSelect = (code: string, name: string) => {
    onSelect(code, name);
    setQuery(name);
    setOpen(false);
  };

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
          onChange={(e) => { setQuery(e.target.value); updateDropdownPosition(); setOpen(true); }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
      </div>

      {open && filtered.length > 0 && createPortal(
        <div
          style={dropdownStyle}
          className="bg-popover border border-border rounded-md shadow-lg max-h-52 overflow-y-auto"
        >
          {filtered.map((state) => (
            <button
              key={state.code}
              type="button"
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer flex justify-between items-center gap-2",
                state.code === value && "bg-accent/50 font-semibold"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(state.code, state.name);
              }}
            >
              <span>{state.name}</span>
              <span className="text-xs text-muted-foreground font-mono shrink-0">{state.code}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
