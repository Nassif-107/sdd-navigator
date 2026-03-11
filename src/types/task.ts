import type { TaskStatus } from "./enums";

// @req SCD-API-005
export interface Task {
  id: string;
  requirementId: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}
