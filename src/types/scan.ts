import type { ScanState } from "./enums";

// @req SCD-API-006
export interface ScanStatus {
  status: ScanState;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}
