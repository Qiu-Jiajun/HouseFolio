import { AppNav } from "@/components/app-nav";
import { ComplianceFooter } from "@/components/compliance-footer";
import { ListingDetailView } from "@/components/listing-detail-view";
import { zhCN } from "@/content/zh-cn";

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
    <main className="hf-warm-scope min-h-screen bg-[#f8f4ec] px-4 py-6 text-[#242114] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <AppNav />

        <div className="mb-6">
          <a
            href="/portfolio"
            className="text-sm text-[#6f675c] hover:text-[#282417]"
          >
            {zhCN.listingDetail.actions.backToPortfolio}
          </a>
        </div>

        <ListingDetailView listingId={id} />

        <ComplianceFooter />
      </section>
    </main>
  );
}
