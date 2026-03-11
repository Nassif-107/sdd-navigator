import { render, screen } from "@testing-library/react";
import { SummaryPanel } from "@/components/summary-panel";
import type { Stats } from "@/types";
import statsData from "@/data/stats.json";

const stats = statsData as Stats;

// @req SCD-UI-001
describe("SummaryPanel", () => {
  it("renders total requirements count", () => {
    render(<SummaryPanel stats={stats} />);
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders type breakdown", () => {
    render(<SummaryPanel stats={stats} />);
    expect(screen.getByText(/FR:/)).toBeInTheDocument();
    expect(screen.getByText(/AR:/)).toBeInTheDocument();
  });

  it("renders coverage percentage", () => {
    render(<SummaryPanel stats={stats} />);
    expect(screen.getByText("62.5%")).toBeInTheDocument();
  });

  it("shows warning indicators for orphans", () => {
    render(<SummaryPanel stats={stats} />);
    const warnings = screen.getAllByLabelText("warning");
    expect(warnings.length).toBeGreaterThanOrEqual(1);
  });

  it("renders last scan timestamp", () => {
    render(<SummaryPanel stats={stats} />);
    expect(screen.getByText(/Last scan:/)).toBeInTheDocument();
  });
});
