import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createCompany, listCompanies } from "@/actions/company-actions";
import { getAuthSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? "";
  const sortBy = (searchParams.get("sortBy") as "name" | "createdAt") ?? "name";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") ?? "asc";

  const result = await listCompanies({ page, limit, search, city, sortBy, sortOrder });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const company = await createCompany(payload);
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to create company" }, { status: 500 });
  }
}
