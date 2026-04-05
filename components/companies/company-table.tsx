"use client";

import { useState } from "react";
import { Copy, Globe, Linkedin, Users } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CompanyItem } from "@/types/company";

type CompanyTableProps = {
  companies: CompanyItem[];
  rowOffset?: number;
};

export function CompanyTable({ companies, rowOffset = 0 }: CompanyTableProps) {
  const [copying, setCopying] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  function toggleRow(id: string) {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function copyText(label: string, value: string) {
    try {
      setCopying(value);
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy link");
    } finally {
      setCopying(null);
    }
  }

  return (
    <div className="overflow-hidden bg-white/72">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
              <TableHead>#</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>LinkedIn Page</TableHead>
              <TableHead>City(s)</TableHead>
              <TableHead>Recruiters</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium text-slate-900">{rowOffset + index + 1}</TableCell>
                <TableCell className="font-medium text-slate-900">{company.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900"
                    >
                      <Globe className="h-4 w-4" />
                      Visit
                    </a>
                    <button
                      type="button"
                      onClick={() => copyText("Website", company.website)}
                      className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                      aria-label="Copy website"
                    >
                      <Copy className={`h-4 w-4 ${copying === company.website ? "text-slate-900" : ""}`} />
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <a
                      href={company.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-sky-700 hover:text-sky-900"
                    >
                      <Linkedin className="h-4 w-4" />
                      Profile
                    </a>
                    <button
                      type="button"
                      onClick={() => copyText("LinkedIn", company.linkedinUrl)}
                      className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                      aria-label="Copy linkedin"
                    >
                      <Copy className={`h-4 w-4 ${copying === company.linkedinUrl ? "text-slate-900" : ""}`} />
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {company.cities.length ? company.cities.join(", ") : "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-100/65 px-2.5 py-1">
                      <span className="inline-flex items-center gap-1.5 px-1 text-xs font-medium text-sky-800">
                        <Users className="h-3.5 w-3.5" />
                        Recruiters
                      </span>
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-800 shadow-sm">
                        {company.recruiters.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {company.recruiters.length ? (
                        
                        company.recruiters.slice(0, expandedRows.has(company.id) ? company.recruiters.length : 3).map((recruiter, index) => (
                          recruiter.linkedinUrl ? (
                            <a
                              key={`${index}-${company.id}-${recruiter.name}`}
                              href={recruiter.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-fit items-center gap-1 text-sm text-slate-600 transition-colors hover:text-sky-700"
                            >
                              <Linkedin className="h-3.5 w-3.5" />
                              {recruiter.name}
                            </a>
                          ) : (
                            <span key={`${index}-${company.id}-${recruiter.name}`} className="text-sm text-slate-600">
                              {recruiter.name}
                            </span>
                          )
                        ))
                      ) : (
                        <span className="text-sm text-slate-600">N/A</span>
                      )}
                      {
                        company.recruiters.length > 3 && (
                          <span onClick={() => toggleRow(company.id)} className="text-xs text-slate-500 hover:cursor-pointer hover:text-slate-700">
                            {expandedRows.has(company.id) ? "Show less" : `+${company.recruiters.length - 3} more`}
                          </span>
                        )
                      }
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!companies.length && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
