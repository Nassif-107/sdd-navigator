import type { RequirementType, CoverageStatus } from "./enums";
import type { Annotation } from "./annotation";
import type { Task } from "./task";

// @req SCD-API-002
export interface Requirement {
  id: string;
  type: RequirementType;
  title: string;
  description: string;
  status: CoverageStatus;
  createdAt: string;
  updatedAt: string;
}

// @req SCD-API-003
export interface RequirementDetail extends Requirement {
  annotations: Annotation[];
  tasks: Task[];
}
