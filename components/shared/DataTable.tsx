"use client";

import { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-2.5">
          <div className="h-3.5 rounded-(--radius-ctrl) bg-(--color-surface-soft) animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "Өгөгдөл олдсонгүй",
  keyExtractor,
}: DataTableProps<T>) {
  const getCellValue = (row: T, col: Column<T>): ReactNode => {
    if (col.render) return col.render(row);
    const val = row[col.key as keyof T];
    if (val === null || val === undefined) return "—";
    return String(val);
  };

  return (
    <div className="w-full overflow-x-auto rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-(--color-border) bg-(--color-surface-soft)">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-3 py-2.5 text-left font-medium text-(--color-text-secondary)"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-(--color-border) last:border-0 hover:bg-(--color-surface-soft) transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-3 py-2.5 text-(--color-text)"
                  >
                    {getCellValue(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
