import Link from "next/link";
import { redirect } from "next/navigation";
import { listCompanies } from "@/actions/company-actions";
import { AdminCompanyTable } from "@/components/admin/admin-company-table";
import { PaginationControls } from "@/components/companies/pagination-controls";
import { SearchControls } from "@/components/companies/search-controls";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import { ExternalLink } from "lucide-react";

type DashboardPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    city?: string;
    sortBy?: "name" | "createdAt";
    sortOrder?: "asc" | "desc";
  }>;
};

export default async function AdminDashboardPage({ searchParams }: DashboardPageProps) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const search = params.search ?? "";
  const city = params.city ?? "";
  const sortBy = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder ?? "desc";

  const data = await listCompanies({
    page,
    limit: 10,
    search,
    city,
    sortBy,
    sortOrder,
  });
  const rowOffset = (data.page - 1) * data.limit;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">Admin Dashboard
              <Link href={`${baseUrl}`} className="text-sky-600 hover:text-sky-500 hover:underline">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </CardTitle>
            <CardDescription>Manage companies, links, locations, and recruiters.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/dashboard/new">
              <Button>Add Company</Button>
            </Link>
            <SignOutButton />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
            <SearchControls search={search} city={city} sortBy={sortBy} sortOrder={sortOrder} basePath="/admin/dashboard" />
          </div>

          <AdminCompanyTable companies={data.companies} rowOffset={rowOffset} />

          <PaginationControls
            page={data.page}
            totalPages={data.totalPages}
            search={search}
            city={city}
            sortBy={sortBy}
            sortOrder={sortOrder}
            basePath="/admin/dashboard"
          />
        </CardContent>
      </Card>
    </main>
  );
}
