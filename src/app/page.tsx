import { getStats } from "@/lib/api";
import { DashboardContent } from "@/components/dashboard-content";

// @req SCD-UI-001
// @req SCD-ERR-001
export default async function Home() {
  const result = await getStats();

  return <DashboardContent result={result} />;
}
