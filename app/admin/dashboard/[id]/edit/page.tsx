import { notFound, redirect } from "next/navigation";
import { getCompanyById } from "@/actions/company-actions";
import { CompanyForm } from "@/components/admin/company-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";

type EditCompanyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const company = await getCompanyById(id);

  if (!company) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Company</CardTitle>
          <CardDescription>Update company information and recruiter details.</CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm
            mode="edit"
            companyId={company.id}
            initialValues={{
              name: company.name,
              website: company.website,
              linkedinUrl: company.linkedinUrl,
              cities: company.cities,
              recruiters: company.recruiters,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
