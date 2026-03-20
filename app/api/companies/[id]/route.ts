import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  deleteCompany,
  getDatabaseConnectionErrorMessage,
  isDatabaseConnectionError,
  updateCompany,
} from "@/actions/company-actions";
import { getAuthSession } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  const session = await getAuthSession();
  const canBypassAuth = process.env.NODE_ENV === "development";
  if (!session?.user && !canBypassAuth) {
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

    if (isDatabaseConnectionError(error)) {
      return NextResponse.json({ message: getDatabaseConnectionErrorMessage(error) }, { status: 503 });
    }

    return NextResponse.json({ message: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAuthSession();
  const canBypassAuth = process.env.NODE_ENV === "development";
  if (!session?.user && !canBypassAuth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteCompany(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return NextResponse.json({ message: getDatabaseConnectionErrorMessage(error) }, { status: 503 });
    }

    return NextResponse.json({ message: "Failed to delete company" }, { status: 500 });
  }
}
