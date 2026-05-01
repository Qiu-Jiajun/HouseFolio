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
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <a href="/portfolio" className="text-sm text-slate-400 hover:text-white">
          ← 返回 Portfolio
        </a>

        <div className="mt-8">
          <ListingDetailView listingId={id} />
        </div>
      </section>
    </main>
  );
}