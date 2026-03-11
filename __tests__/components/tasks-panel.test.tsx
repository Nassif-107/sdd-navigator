import { render, screen, fireEvent } from "@testing-library/react";
import { TasksPanel } from "@/components/tasks-panel";
import tasks from "@/data/tasks.json";
import type { Task } from "@/types";

const allTasks = tasks as Task[];

const mockListTasks = jest.fn();
jest.mock("@/lib/api", () => ({
  listTasks: (...args: unknown[]) => mockListTasks(...args),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  listRequirements: jest.fn().mockResolvedValue({ ok: true, data: require("@/data/requirements.json") }),
}));

// @req SCD-UI-004
describe("TasksPanel", () => {
  beforeEach(() => {
    mockListTasks.mockResolvedValue({ ok: true, data: allTasks });
  });

  it("renders task rows", async () => {
    render(<TasksPanel />);
    const items = await screen.findAllByText("TASK-001");
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("TASK-006").length).toBeGreaterThanOrEqual(1);
  });

  it("highlights orphan tasks", async () => {
    render(<TasksPanel />);
    await screen.findAllByText("TASK-006");
    const orphanWarnings = screen.getAllByLabelText("orphan");
    expect(orphanWarnings.length).toBeGreaterThanOrEqual(1);
  });

  it("filters by status correctly", async () => {
    render(<TasksPanel />);
    await screen.findAllByText("TASK-001");
    fireEvent.click(screen.getByRole("button", { name: "done" }));
    // done tasks: TASK-001, TASK-002. Others should be hidden.
    const doneTasks = allTasks.filter((t) => t.status === "done");
    const nonDoneTasks = allTasks.filter((t) => t.status !== "done");

    for (const t of doneTasks) {
      expect(screen.getAllByText(t.id).length).toBeGreaterThanOrEqual(1);
    }
    for (const t of nonDoneTasks) {
      expect(screen.queryByText(t.id)).not.toBeInTheDocument();
    }
  });
});
