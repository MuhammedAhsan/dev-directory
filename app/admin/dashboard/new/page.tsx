import { redirect } from "next/navigation";
import { CompanyForm } from "@/components/admin/company-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";

export default async function NewCompanyPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Company</CardTitle>
          <CardDescription>Provide website, LinkedIn URL, cities, and recruiters.</CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm mode="create" />
        </CardContent>
      </Card>
    </main>
  );
}
