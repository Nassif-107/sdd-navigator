import { Suspense } from "react";
import { RequirementDetailLoader } from "@/components/requirement-detail-loader";

// @req SCD-UI-003
export default async function RequirementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<p className="py-8 text-center text-foreground/60" role="status">Loading requirement…</p>}>
      <RequirementDetailLoader id={id} />
    </Suspense>
  );
}
