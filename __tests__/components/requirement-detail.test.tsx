import { render, screen } from "@testing-library/react";
import { RequirementDetail } from "@/components/requirement-detail";
import type { RequirementDetail as RequirementDetailType, Requirement, Annotation, Task } from "@/types";
import requirementsData from "@/data/requirements.json";
import annotationsData from "@/data/annotations.json";
import tasksData from "@/data/tasks.json";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Derive a RequirementDetail from mock data files
const baseReq = (requirementsData as Requirement[])[0]; // FR-SCAN-001
const linkedAnnotations = (annotationsData as Annotation[]).filter((a) => a.reqId === baseReq.id);
const linkedTasks = (tasksData as Task[]).filter((t) => t.requirementId === baseReq.id);

const mockRequirement: RequirementDetailType = {
  ...baseReq,
  annotations: linkedAnnotations,
  tasks: linkedTasks,
};

// @req SCD-UI-003
describe("RequirementDetail", () => {
  it("displays all metadata fields", () => {
    render(<RequirementDetail requirement={mockRequirement} />);
    expect(screen.getByText(baseReq.id)).toBeInTheDocument();
    expect(screen.getByText(baseReq.title)).toBeInTheDocument();
    expect(screen.getByText(baseReq.type)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(baseReq.description.slice(0, 30)))).toBeInTheDocument();
  });

  it("renders linked annotations with snippets", () => {
    render(<RequirementDetail requirement={mockRequirement} />);
    for (const ann of linkedAnnotations) {
      expect(screen.getByText(`${ann.file}:${ann.line}`)).toBeInTheDocument();
      expect(screen.getByText((_content, element) => element?.textContent === ann.snippet)).toBeInTheDocument();
    }
  });

  it("renders linked tasks", () => {
    render(<RequirementDetail requirement={mockRequirement} />);
    for (const task of linkedTasks) {
      expect(screen.getByText(task.id)).toBeInTheDocument();
      expect(screen.getByText(task.title)).toBeInTheDocument();
    }
  });

  it("shows Fully covered label when impl and test annotations exist", () => {
    render(<RequirementDetail requirement={mockRequirement} />);
    const hasImpl = linkedAnnotations.some((a) => a.type === "impl");
    const hasTest = linkedAnnotations.some((a) => a.type === "test");
    if (hasImpl && hasTest) {
      expect(screen.getByText("Fully covered")).toBeInTheDocument();
    }
  });

  it("shows Needs tests when only impl annotations exist", () => {
    const implOnly = { ...mockRequirement, annotations: linkedAnnotations.filter((a) => a.type === "impl") };
    render(<RequirementDetail requirement={implOnly} />);
    expect(screen.getByText("Needs tests")).toBeInTheDocument();
  });

  it("shows Not implemented when no annotations exist", () => {
    const noAnnotations = { ...mockRequirement, annotations: [] };
    render(<RequirementDetail requirement={noAnnotations} />);
    expect(screen.getByText("Not implemented")).toBeInTheDocument();
  });
});
