import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { getAuthSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-slate-500">Loading login form...</p>}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
