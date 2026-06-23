"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKeys = [],
  pageSize = 10,
  emptyMessage = "No data found",
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  if (filtered.length === 0) {
    return (
      <div className="space-y-4">
        {searchKeys.length > 0 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9"
            />
          </div>
        )}
        <EmptyState title="No matching results" description="Try a different search term." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchKeys.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
      )}
      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold">{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((item) => {
              const rowKey = String((item as { id?: string }).id ?? JSON.stringify(item));
              return (
              <TableRow
                key={rowKey}
                className={onRowClick ? "cursor-pointer hover:bg-teal-50/50" : ""}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(item) : String(item[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            );})}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
