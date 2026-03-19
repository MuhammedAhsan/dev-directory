import Link from "next/link";
import { redirect } from "next/navigation";
import { listCompanies } from "@/actions/company-actions";
import { AdminCompanyTable } from "@/components/admin/admin-company-table";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";

type DashboardPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function AdminDashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const page = Number(params.page ?? "1");

  const data = await listCompanies({
    page,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Admin Dashboard</CardTitle>
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
          <AdminCompanyTable companies={data.companies} />
        </CardContent>
      </Card>
    </main>
  );
}
