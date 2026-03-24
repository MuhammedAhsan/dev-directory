import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchControlsProps = {
  search: string;
  city: string;
  sortBy: "name" | "createdAt";
  sortOrder: "asc" | "desc";
  basePath?: string;
};

export function SearchControls({ search, city, sortBy, sortOrder, basePath = "/" }: SearchControlsProps) {
  return (
    <form className="grid gap-3 md:grid-cols-4" action={basePath} method="get">
      <Input name="search" placeholder="Search company or city" defaultValue={search} />
      <Input name="city" placeholder="Filter city (e.g. Lahore)" defaultValue={city} />
      <select
        name="sortBy"
        defaultValue={sortBy}
        className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <option value="name">Sort by Name</option>
        <option value="createdAt">Sort by Newest</option>
      </select>
      <select
        name="sortOrder"
        defaultValue={sortOrder}
        className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <div className="md:col-span-4 flex flex-wrap items-center gap-2">
        <Button type="submit">Apply</Button>
        <Link
          href={basePath}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
