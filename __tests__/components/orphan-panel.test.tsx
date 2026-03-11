import { render, screen } from "@testing-library/react";
import { OrphanPanel } from "@/components/orphan-panel";

jest.mock("@/lib/api", () => {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const annotations = require("@/data/annotations.json");
  const tasks = require("@/data/tasks.json");
  const requirements = require("@/data/requirements.json");
  /* eslint-enable @typescript-eslint/no-require-imports */
  const validIds = new Set(requirements.map((r: { id: string }) => r.id));
  return {
    listAnnotations: jest.fn().mockResolvedValue({
      ok: true,
      data: annotations.filter((a: { reqId: string }) => !validIds.has(a.reqId)),
    }),
    listTasks: jest.fn().mockResolvedValue({
      ok: true,
      data: tasks.filter((t: { requirementId: string }) => !validIds.has(t.requirementId)),
    }),
  };
});

// @req SCD-UI-005
describe("OrphanPanel", () => {
  it("renders annotation orphans", async () => {
    render(<OrphanPanel />);
    expect(await screen.findByText(/UNKNOWN-001/)).toBeInTheDocument();
    expect(screen.getByText(/UNKNOWN-002/)).toBeInTheDocument();
  });

  it("renders task orphans", async () => {
    render(<OrphanPanel />);
    expect(await screen.findByText(/UNKNOWN-REQ/)).toBeInTheDocument();
  });

  it("has collapsible sections", async () => {
    render(<OrphanPanel />);
    await screen.findByText(/Annotation Orphans/);
    const details = document.querySelectorAll("details");
    expect(details.length).toBe(2);
  });
});
