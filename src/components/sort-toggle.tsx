"use client";

// @req SCD-UI-002
// @req SCD-ACC-001
export function SortToggle({
  field,
  currentSort,
  currentOrder,
  onSort,
  children,
}: {
  field: string;
  currentSort: string;
  currentOrder: "asc" | "desc";
  onSort: (field: string) => void;
  children: React.ReactNode;
}) {
  const isActive = currentSort === field;
  const ariaSortValue = isActive ? (currentOrder === "asc" ? "ascending" : "descending") : undefined;

  return (
    <th
      aria-sort={ariaSortValue}
      className="cursor-pointer select-none px-4 py-2 text-left text-sm font-medium"
    >
      <button
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1"
      >
        {children}
        {isActive && (
          <span aria-hidden="true">{currentOrder === "asc" ? "\u2191" : "\u2193"}</span>
        )}
      </button>
    </th>
  );
}
