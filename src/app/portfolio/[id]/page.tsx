import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { ListingDetailView } from "@/components/listing-detail-view";

type ListingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <AppNav />

        <div className="mb-6">
          <a
            href="/portfolio"
            className="text-sm text-slate-400 hover:text-white"
          >
            Back to Portfolio
          </a>
        </div>

        <ListingDetailView listingId={id} />

        <ComplianceFooter />
      </section>
    </main>
  );
}