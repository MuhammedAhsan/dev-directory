import { randomUUID } from "node:crypto";
import { supabase } from "@/lib/supabase";
import { companySchema, type CompanySchemaInput } from "@/lib/validations/company";
import { toRecruiterArray, toStringArray } from "@/lib/utils";
import type { CompanyItem, CompanyListResult } from "@/types/company";

type ListCompaniesParams = {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};

type CompanyRow = {
  id: string;
  name: string;
  website: string;
  linkedinUrl: string;
  cities: unknown;
  recruiters: unknown;
  createdAt: string | Date;
  updatedAt: string | Date;
};

function toErrorInfo(error: unknown): { code?: string; message: string } {
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    return {
      code: typeof record.code === "string" ? record.code : undefined,
      message: typeof record.message === "string" ? record.message : "Unknown database error",
    };
  }

  return {
    message: String(error ?? "Unknown database error"),
  };
}

export function isDatabaseConnectionError(error: unknown): boolean {
  const info = toErrorInfo(error);

  if (info.code === "P1001") {
    return true;
  }

  const lowerMessage = info.message.toLowerCase();
  return (
    lowerMessage.includes("can't reach database server") ||
    lowerMessage.includes("fetch failed") ||
    lowerMessage.includes("enotfound") ||
    lowerMessage.includes("econnrefused") ||
    lowerMessage.includes("timed out")
  );
}

export function getDatabaseConnectionErrorMessage(error: unknown): string {
  if (!isDatabaseConnectionError(error)) {
    return "Database operation failed";
  }

  return "Database is unreachable. Update DATABASE_URL and DIRECT_URL with the current Supabase connection strings from Project Settings > Database.";
}

function mapCompany(company: CompanyRow): CompanyItem {
  return {
    ...company,
    cities: toStringArray(company.cities),
    recruiters: toRecruiterArray(company.recruiters),
    createdAt: new Date(company.createdAt),
    updatedAt: new Date(company.updatedAt),
  };
}

function assertNoSupabaseError(error: unknown) {
  if (!error) {
    return;
  }

  const info = toErrorInfo(error);
  const wrapped = new Error(info.message);
  (wrapped as Error & { code?: string }).code = info.code;
  throw wrapped;
}

export async function listCompanies({
  page = 1,
  limit = 10,
  search = "",
  city = "",
  sortBy = "name",
  sortOrder = "asc",
}: ListCompaniesParams = {}): Promise<CompanyListResult> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 10;
  const skip = (safePage - 1) * safeLimit;

  const { data, error } = await supabase
    .from("Company")
    .select("id,name,website,linkedinUrl,cities,recruiters,createdAt,updatedAt")
    .order(sortBy, { ascending: sortOrder === "asc" });

  assertNoSupabaseError(error);
  const allCompanies = (data ?? []) as CompanyRow[];

  const normalizedSearch = search.trim().toLowerCase();
  const normalizedCity = city.trim().toLowerCase();

  const filtered = allCompanies.filter((company) => {
    const cities = toStringArray(company.cities).map((entry) => entry.toLowerCase());
    const recruiters = toRecruiterArray(company.recruiters).map((entry) => entry.name.toLowerCase());
    const matchesSearch =
      !normalizedSearch ||
      company.name.toLowerCase().includes(normalizedSearch) ||
      cities.some((entry) => entry.includes(normalizedSearch)) ||
      recruiters.some((entry) => entry.includes(normalizedSearch));

    const matchesCity = !normalizedCity || cities.includes(normalizedCity);
    return matchesSearch && matchesCity;
  });

  const paginated = filtered.slice(skip, skip + safeLimit).map(mapCompany);
  const total = filtered.length;

  return {
    companies: paginated,
    total,
    totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    page: safePage,
    limit: safeLimit,
  };
}

export async function getCompanyById(id: string) {
  const { data, error } = await supabase
    .from("Company")
    .select("id,name,website,linkedinUrl,cities,recruiters,createdAt,updatedAt")
    .eq("id", id)
    .maybeSingle();

  assertNoSupabaseError(error);
  return data ? mapCompany(data as CompanyRow) : null;
}

export async function createCompany(payload: CompanySchemaInput) {
  const validated = companySchema.parse(payload);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("Company")
    .insert({
      id: randomUUID().replace(/-/g, "").slice(0, 24),
      name: validated.name,
      website: validated.website,
      linkedinUrl: validated.linkedinUrl,
      cities: validated.cities,
      recruiters: validated.recruiters,
      createdAt: now,
      updatedAt: now,
    })
    .select("id,name,website,linkedinUrl,cities,recruiters,createdAt,updatedAt")
    .single();

  assertNoSupabaseError(error);
  return mapCompany(data as CompanyRow);
}

export async function updateCompany(id: string, payload: CompanySchemaInput) {
  const validated = companySchema.parse(payload);

  const { data, error } = await supabase
    .from("Company")
    .update({
      name: validated.name,
      website: validated.website,
      linkedinUrl: validated.linkedinUrl,
      cities: validated.cities,
      recruiters: validated.recruiters,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id,name,website,linkedinUrl,cities,recruiters,createdAt,updatedAt")
    .single();

  assertNoSupabaseError(error);
  return mapCompany(data as CompanyRow);
}

export async function deleteCompany(id: string) {
  const { error } = await supabase.from("Company").delete().eq("id", id);
  assertNoSupabaseError(error);
}
