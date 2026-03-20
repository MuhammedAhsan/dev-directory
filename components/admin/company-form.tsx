"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { companySchema, type CompanySchemaInput } from "@/lib/validations/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RecruiterProfile } from "@/types/company";

type CompanyFormProps = {
  mode: "create" | "edit";
  companyId?: string;
  initialValues?: CompanySchemaInput;
};

function parseCommaSeparated(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseRecruiters(input: string): RecruiterProfile[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, linkedinPart] = line.split("|").map((entry) => entry.trim());
      return {
        name: namePart ?? "",
        linkedinUrl: linkedinPart ?? "",
      };
    })
    .filter((entry) => entry.name || entry.linkedinUrl);
}

export function CompanyForm({ mode, companyId, initialValues }: CompanyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [website, setWebsite] = useState(initialValues?.website ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialValues?.linkedinUrl ?? "");
  const [cities, setCities] = useState(initialValues?.cities?.join(", ") ?? "");
  const [recruiters, setRecruiters] = useState(
    initialValues?.recruiters?.map((entry) => `${entry.name} | ${entry.linkedinUrl}`).join("\n") ?? ""
  );
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const payload: CompanySchemaInput = {
      name,
      website,
      linkedinUrl,
      cities: parseCommaSeparated(cities),
      recruiters: parseRecruiters(recruiters),
    };

    const parsed = companySchema.safeParse(payload);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please check your inputs");
      setIsSubmitting(false);
      return;
    }

    setFormError(null);

    const response = await fetch(mode === "create" ? "/api/companies" : `/api/companies/${companyId}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.message ?? "Operation failed");
      return;
    }

    toast.success(mode === "create" ? "Company created" : "Company updated");
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Company Name
        </label>
        <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Acme Technologies" />
      </div>

      <div>
        <label htmlFor="website" className="mb-1 block text-sm font-medium text-slate-700">
          Website URL
        </label>
        <Input id="website" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://example.com" />
      </div>

      <div>
        <label htmlFor="linkedinUrl" className="mb-1 block text-sm font-medium text-slate-700">
          LinkedIn URL
        </label>
        <Input
          id="linkedinUrl"
          value={linkedinUrl}
          onChange={(event) => setLinkedinUrl(event.target.value)}
          placeholder="https://linkedin.com/company/example"
        />
      </div>

      <div>
        <label htmlFor="cities" className="mb-1 block text-sm font-medium text-slate-700">
          Cities (comma separated)
        </label>
        <Input id="cities" value={cities} onChange={(event) => setCities(event.target.value)} placeholder="Karachi, Lahore" />
      </div>

      <div>
        <label htmlFor="recruiters" className="mb-1 block text-sm font-medium text-slate-700">
          Recruiters (one per line in this format: Name | LinkedIn URL)
        </label>
        <textarea
          id="recruiters"
          value={recruiters}
          onChange={(event) => setRecruiters(event.target.value)}
          placeholder={"Ali Khan | https://www.linkedin.com/in/ali-khan\nSara Ahmed | https://www.linkedin.com/in/sara-ahmed"}
          className="min-h-32 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        />
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : mode === "create" ? "Add Company" : "Update Company"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
