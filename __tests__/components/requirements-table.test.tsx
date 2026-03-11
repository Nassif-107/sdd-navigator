import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RequirementsTable } from "@/components/requirements-table";
import requirements from "@/data/requirements.json";
import type { Requirement } from "@/types";

const allRequirements = requirements as Requirement[];

// Mock next/navigation
const mockPush = jest.fn();
let currentSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => currentSearchParams,
}));

// Mock the API — use a function so we can vary the response per-test
const mockListRequirements = jest.fn();
jest.mock("@/lib/api", () => ({
  listRequirements: (...args: unknown[]) => mockListRequirements(...args),
}));

// @req SCD-UI-002
describe("RequirementsTable", () => {
  beforeEach(() => {
    mockPush.mockClear();
    currentSearchParams = new URLSearchParams();
    mockListRequirements.mockResolvedValue({ ok: true, data: allRequirements });
  });

  it("renders correct number of rows", async () => {
    render(<RequirementsTable />);
    const rows = await screen.findAllByRole("row");
    // 8 data rows + 1 header row
    expect(rows.length).toBe(9);
  });

  it("renders requirement IDs", async () => {
    render(<RequirementsTable />);
    const items = await screen.findAllByText("FR-SCAN-001");
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("AR-PERF-001").length).toBeGreaterThanOrEqual(1);
  });

  it("renders empty state when no results match", async () => {
    mockListRequirements.mockResolvedValueOnce({ ok: true, data: [] });
    render(<RequirementsTable />);
    expect(await screen.findByText(/No requirements match/)).toBeInTheDocument();
  });

  it("filtering by type produces correct subset", async () => {
    const frOnly = allRequirements.filter((r) => r.type === "FR");
    mockListRequirements.mockResolvedValue({ ok: true, data: frOnly });
    currentSearchParams = new URLSearchParams("type=FR");
    render(<RequirementsTable />);
    const rows = await screen.findAllByRole("row");
    // 6 FR rows + 1 header
    expect(rows.length).toBe(7);
  });

  it("filtering by status produces correct subset", async () => {
    const covered = allRequirements.filter((r) => r.status === "covered");
    mockListRequirements.mockResolvedValue({ ok: true, data: covered });
    currentSearchParams = new URLSearchParams("status=covered");
    render(<RequirementsTable />);
    const rows = await screen.findAllByRole("row");
    // 5 covered rows + 1 header
    expect(rows.length).toBe(6);
  });

  it("sorting by ID changes order", async () => {
    render(<RequirementsTable />);
    await screen.findAllByRole("row");
    fireEvent.click(screen.getByRole("button", { name: /ID/ }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("sort=id"));
    });
  });

  it("sorting by updatedAt changes order", async () => {
    render(<RequirementsTable />);
    await screen.findAllByRole("row");
    fireEvent.click(screen.getByRole("button", { name: /Updated/ }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("sort=updatedAt"));
    });
  });
});
