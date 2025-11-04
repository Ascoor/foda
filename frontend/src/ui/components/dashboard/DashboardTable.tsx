import type { ReactNode } from "react";

import { cn } from "@/infrastructure/shared/lib/utils";

export interface DashboardTableColumn<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T, index: number) => ReactNode;
}

export interface DashboardTableProps<T> {
  columns: DashboardTableColumn<T>[];
  rows: T[];
  getRowKey?: (row: T, index: number) => React.Key;
  emptyState?: ReactNode;
}

export function DashboardTable<T>({
  columns,
  rows,
  getRowKey,
  emptyState,
}: DashboardTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white/70 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-white/30 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80 dark:bg-slate-900/30">
            {columns.map((column) => (
              <th
                key={column.key as React.Key}
                className={cn(
                  "px-6 py-3 text-left",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                )}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-muted-foreground"
              >
                {emptyState ?? "No data available"}
              </td>
            </tr>
          )}
          {rows.map((row, index) => {
            const key = getRowKey?.(row, index) ?? index;
            return (
              <tr
                key={key}
                className="group border-t border-white/10 text-foreground transition hover:bg-white/50 dark:border-white/5 dark:hover:bg-slate-900/70"
              >
                {columns.map((column) => {
                  const value = column.render
                    ? column.render(row, index)
                    : ((row as Record<string, unknown>)[
                        column.key as keyof typeof row
                      ] as ReactNode);

                  return (
                    <td
                      key={`${key}-${column.key as React.Key}`}
                      className={cn(
                        "px-6 py-4 align-middle text-sm",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
