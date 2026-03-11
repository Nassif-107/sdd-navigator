// @req SCD-API-006

import type { ScanState } from "./enums";

export interface ScanStatus {
  status: ScanState;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}
