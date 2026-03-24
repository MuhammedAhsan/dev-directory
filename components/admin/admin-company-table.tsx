"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CompanyItem } from "@/types/company";

type AdminCompanyTableProps = {
  companies: CompanyItem[];
  rowOffset?: number;
};

export function AdminCompanyTable({ companies, rowOffset = 0 }: AdminCompanyTableProps) {
  const router = useRouter();

  async function deleteRecord(id: string) {
    const confirmed = window.confirm("Delete this company?");
    if (!confirmed) return;

    const response = await fetch(`/api/companies/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Company deleted");
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Cities</TableHead>
              <TableHead>Recruiters</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{rowOffset + index + 1}</TableCell>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.cities.join(", ") || "-"}</TableCell>
                <TableCell>{company.recruiters.length}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Link href={`/admin/dashboard/${company.id}/edit`} className="inline-flex">
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link>
                    <Button size="sm" variant="danger" onClick={() => deleteRecord(company.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!companies.length && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                  No companies available yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
