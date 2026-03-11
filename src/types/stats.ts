// @req SCD-API-001

import type { RequirementType, CoverageStatus, TaskStatus } from "./enums";

export interface Stats {
  requirements: {
    total: number;
    byType: Record<RequirementType, number>;
    byStatus: Record<CoverageStatus, number>;
  };
  annotations: {
    total: number;
    impl: number;
    test: number;
    orphans: number;
  };
  tasks: {
    total: number;
    byStatus: Record<TaskStatus, number>;
    orphans: number;
  };
  coverage: number;
  lastScanAt: string;
}
