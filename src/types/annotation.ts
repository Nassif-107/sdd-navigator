// @req SCD-API-004

import type { AnnotationType } from "./enums";

export interface Annotation {
  file: string;
  line: number;
  reqId: string;
  type: AnnotationType;
  snippet: string;
}
