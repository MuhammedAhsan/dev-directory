import { listCompanies } from "@/actions/company-actions";
import { CompanyTable } from "@/components/companies/company-table";
import { PaginationControls } from "@/components/companies/pagination-controls";
import { SearchControls } from "@/components/companies/search-controls";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Building2, Users, MapPin, ArrowDownRight } from "lucide-react";

type HomePageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    city?: string;
    sortBy?: "name" | "createdAt";
    sortOrder?: "asc" | "desc";
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? "1");
  const search = params.search ?? "";
  const city = params.city ?? "";
  const sortBy = params.sortBy ?? "name";
  const sortOrder = params.sortOrder ?? "asc";

  const data = await listCompanies({
    page,
    limit: 10,
    search,
    city,
    sortBy,
    sortOrder,
  });

  const totalRecruiters = data.companies.reduce((sum, company) => sum + company.recruiters.length, 0);
  const topCities = Array.from(
    new Set(data.companies.flatMap((company) => company.cities.map((cityName) => cityName.trim())).filter(Boolean))
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef6ff,#f8fbff_40%,#f8fafc_80%)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:pt-12">

        {/* Hero Section */}
        <section className="relative isolate overflow-visible px-1 py-10 sm:px-3 lg:px-4">
          <div className="pointer-events-none absolute -right-14 -top-12 h-52 w-52 animate-float rounded-full bg-sky-200/90 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 left-10 h-44 w-44 animate-float-delay rounded-full bg-blue-200/90 blur-3xl" />

          <div className="relative animate-fade-up space-y-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" className="px-3 py-1 text-xs">Modern SaaS Experience</Badge>
              <Badge className="border-sky-200 bg-sky-50 text-sky-700">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Dev Directory
              </Badge>
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Discover Pakistan&rsquo;s best tech teams, curated for faster job targeting.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              A premium directory of hiring companies, verified links, and recruiter profiles designed for focused outreach.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#companies"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Explore Companies
                <ArrowDownRight className="h-4 w-4" />
              </a>
              <a
                href="#details"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700"
              >
                See Insights
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/55 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/75">
                <p className="inline-flex items-center gap-2 text-sm text-slate-500"><Building2 className="h-4 w-4" />Companies</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{data.total}</p>
              </div>
              <div className="rounded-3xl bg-white/55 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/75">
                <p className="inline-flex items-center gap-2 text-sm text-slate-500"><Users className="h-4 w-4" />Recruiters</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{totalRecruiters}</p>
              </div>
              <div className="rounded-3xl bg-white/55 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/75">
                <p className="inline-flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" />Active cities</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{topCities.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="mt-4 animate-fade-up-delay px-1 sm:px-3 lg:px-4">
          <div className="rounded-3xl bg-white/65 px-5 py-3 backdrop-blur sm:px-6">
          <p className="text-sm text-slate-600">
            Trusted by candidates targeting engineering, product, and data roles across
            <span className="font-medium text-slate-800"> Karachi, Lahore, Islamabad, and beyond.</span>
          </p>
          </div>
        </section>

        {/* Companies Section */}
        <section id="companies" className="scroll-mt-24 mt-10 animate-fade-up-delay px-1 sm:px-3 lg:px-4">
          <div className="mb-5 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Companies</h2>
            <p className="mt-2 text-slate-600">
                Use smart filters to quickly narrow down companies by name, city, or sorting preference.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl bg-white/65 p-4 backdrop-blur sm:p-5">
              <SearchControls search={search} city={city} sortBy={sortBy} sortOrder={sortOrder} />
            </div>

            <div className="rounded-3xl bg-white/68 p-2 space-y-8 backdrop-blur sm:p-3">
              <CompanyTable companies={data.companies} />

              <PaginationControls
                page={data.page}
                totalPages={data.totalPages}
                search={search}
                city={city}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            </div>
          </div>
        </section>

        {/* Why This Works Section */}
        <section id="details" className="scroll-mt-24 mt-10 animate-fade-up-delay-2 px-1 sm:px-3 lg:px-4">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Why This Works</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl bg-white/62 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/82">
              <h4 className="text-lg font-semibold text-slate-900">Company Details</h4>
              <p className="mt-2 text-sm text-slate-600">High-signal listings with official website, LinkedIn page, cities, and hiring contacts.</p>
            </article>
            <article className="rounded-3xl bg-white/62 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/82">
              <h4 className="text-lg font-semibold text-slate-900">Recruiter Profiles</h4>
              <p className="mt-2 text-sm text-slate-600">Click through recruiter LinkedIn profiles directly to build your outreach workflow.</p>
            </article>
            <article className="rounded-3xl bg-white/62 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/82">
              <h4 className="text-lg font-semibold text-slate-900">City Coverage</h4>
              <p className="mt-2 text-sm text-slate-600">
                {topCities.length ? topCities.join(", ") : "City data updates automatically as companies are added."}
              </p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
