"use client";

// @req SCD-UI-002
export function FilterChips<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="text-sm font-medium text-foreground/60">{label}</legend>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            aria-pressed={active}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 hover:border-foreground/40"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </fieldset>
  );
}
