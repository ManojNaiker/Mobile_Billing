import React, { useState, useRef, useEffect } from "react";
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

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-8 pr-12"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          autoComplete="off"
        />
        {value && (
          <span className="absolute right-2.5 top-2 text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
            {value}
          </span>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-52 overflow-y-auto"
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
        </div>
      )}
    </div>
  );
}
