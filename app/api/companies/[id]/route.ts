import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { deleteCompany, updateCompany } from "@/actions/company-actions";
import { getAuthSession } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { id } = await params;
    const company = await updateCompany(id, payload);
    return NextResponse.json(company);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteCompany(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete company" }, { status: 500 });
  }
}
