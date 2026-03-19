import { prisma } from "@/lib/prisma";
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

function isDatabaseConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { code?: string; message?: string };

  if (maybeError.code === "P1001") {
    return true;
  }

  return maybeError.message?.includes("Can't reach database server") ?? false;
}

function mapCompany(company: {
  id: string;
  name: string;
  website: string;
  linkedinUrl: string;
  cities: unknown;
  recruiters: unknown;
  createdAt: Date;
  updatedAt: Date;
}): CompanyItem {
  return {
    ...company,
    cities: toStringArray(company.cities),
    recruiters: toRecruiterArray(company.recruiters),
  };
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

  let allCompanies: Array<{
    id: string;
    name: string;
    website: string;
    linkedinUrl: string;
    cities: unknown;
    recruiters: unknown;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  try {
    allCompanies = await prisma.company.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      throw error;
    }
  }

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
  let company = null;

  try {
    company = await prisma.company.findUnique({ where: { id } });
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      throw error;
    }
  }

  return company ? mapCompany(company) : null;
}

export async function createCompany(payload: CompanySchemaInput) {
  const validated = companySchema.parse(payload);

  const company = await prisma.company.create({
    data: {
      name: validated.name,
      website: validated.website,
      linkedinUrl: validated.linkedinUrl,
      cities: validated.cities,
      recruiters: validated.recruiters,
    },
  });

  return mapCompany(company);
}

export async function updateCompany(id: string, payload: CompanySchemaInput) {
  const validated = companySchema.parse(payload);

  const company = await prisma.company.update({
    where: { id },
    data: {
      name: validated.name,
      website: validated.website,
      linkedinUrl: validated.linkedinUrl,
      cities: validated.cities,
      recruiters: validated.recruiters,
    },
  });

  return mapCompany(company);
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({ where: { id } });
}
