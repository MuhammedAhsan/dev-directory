import Link from "next/link";
type PaginationControlsProps = {
  page: number;
  totalPages: number;
  search: string;
  city: string;
  sortBy: string;
  sortOrder: string;
  basePath?: string;
};

function createQuery(basePath: string, page: number, search: string, city: string, sortBy: string, sortOrder: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (search) params.set("search", search);
  if (city) params.set("city", city);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);
  return `${basePath}?${params.toString()}#companies`;
}

export function PaginationControls({
  page,
  totalPages,
  search,
  city,
  sortBy,
  sortOrder,
  basePath = "/",
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pb-2 pt-4">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        {page <= 1 ? (
          <span className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-400">
            Previous
          </span>
        ) : (
          <Link
            href={createQuery(basePath, page - 1, search, city, sortBy, sortOrder)}
            className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            Previous
          </Link>
        )}
        {page >= totalPages ? (
          <span className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-400">
            Next
          </span>
        ) : (
          <Link
            href={createQuery(basePath, page + 1, search, city, sortBy, sortOrder)}
            className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
