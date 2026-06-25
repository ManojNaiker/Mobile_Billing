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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = INDIAN_STATES.find(s => s.code === value);
    setQuery(state?.name ?? "");
  }, [value]);

  const filtered = query.length === 0
    ? INDIAN_STATES
    : INDIAN_STATES.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        const state = INDIAN_STATES.find(s => s.code === value);
        setQuery(state?.name ?? "");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-8"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        {value && (
          <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground font-mono bg-muted px-1 rounded">
            {value}
          </span>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-56 overflow-y-auto">
          {filtered.map((state) => (
            <button
              key={state.code}
              type="button"
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer flex justify-between items-center",
                state.code === value && "bg-accent/60 font-semibold"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(state.code, state.name);
                setQuery(state.name);
                setOpen(false);
              }}
            >
              <span>{state.name}</span>
              <span className="text-xs text-muted-foreground font-mono ml-2">{state.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
