import type { AnnotationType } from "./enums";

// @req SCD-API-004
export interface Annotation {
  file: string;
  line: number;
  reqId: string;
  type: AnnotationType;
  snippet: string;
}
