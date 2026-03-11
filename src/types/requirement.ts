// @req SCD-API-002
// @req SCD-API-003

import type { RequirementType, CoverageStatus } from "./enums";
import type { Annotation } from "./annotation";
import type { Task } from "./task";

export interface Requirement {
  id: string;
  type: RequirementType;
  title: string;
  description: string;
  status: CoverageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RequirementDetail extends Requirement {
  annotations: Annotation[];
  tasks: Task[];
}
