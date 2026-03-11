// @req SCD-API-005

import type { TaskStatus } from "./enums";

export interface Task {
  id: string;
  requirementId: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}
