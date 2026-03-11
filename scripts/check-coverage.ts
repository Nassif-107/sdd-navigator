// ENF-007: Traceability enforcement script
// Parse requirements.yaml for all SCD-* IDs, scan source for @req annotations,
// print coverage report, exit 1 if gaps.

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const REQUIREMENTS_PATH = path.join(ROOT, "requirements.yaml");
const SCAN_DIRS = [
  path.join(ROOT, "src"),
  path.join(ROOT, "__tests__"),
  path.join(ROOT, "e2e"),
  path.join(ROOT, "scripts"),
];
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".md"];

function parseRequirementIds(yamlPath: string): string[] {
  const content = fs.readFileSync(yamlPath, "utf-8");
  const ids: string[] = [];
  const regex = /^- id:\s+(SCD-[\w-]+)/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

function collectFiles(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  function walk(d: string): void {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") continue;
        walk(full);
      } else if (SOURCE_EXTENSIONS.includes(path.extname(entry.name))) {
        files.push(full);
      }
    }
  }

  walk(dir);
  return files;
}

interface RefInfo {
  file: string;
  line: number;
}

function scanForRefs(files: string[]): Map<string, RefInfo[]> {
  const refs = new Map<string, RefInfo[]>();
  const regex = /@req\s+(SCD-[\w-]+)/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let match: RegExpExecArray | null;
      regex.lastIndex = 0;
      while ((match = regex.exec(lines[i])) !== null) {
        const id = match[1];
        if (!refs.has(id)) refs.set(id, []);
        refs.get(id)!.push({ file: path.relative(ROOT, file), line: i + 1 });
      }
    }
  }

  return refs;
}

function isTestFile(filePath: string): boolean {
  return filePath.startsWith("__tests__/") || filePath.startsWith("e2e/") || filePath.includes(".test.");
}

function isSourceFile(filePath: string): boolean {
  return filePath.startsWith("src/") || filePath.startsWith("scripts/") || filePath.endsWith(".md");
}

// --- Main ---

const reqIds = parseRequirementIds(REQUIREMENTS_PATH);
if (reqIds.length === 0) {
  console.error("ERROR: No requirement IDs found in requirements.yaml");
  process.exit(1);
}

// Also scan root-level .md files (e.g. README.md)
const rootMdFiles = fs.readdirSync(ROOT)
  .filter((f) => f.endsWith(".md"))
  .map((f) => path.join(ROOT, f));
const allFiles = [...SCAN_DIRS.flatMap(collectFiles), ...rootMdFiles];
const allRefs = scanForRefs(allFiles);

console.log("=== SDD Traceability Report ===\n");
console.log(`Requirements: ${reqIds.length}`);
console.log(`Files scanned: ${allFiles.length}`);
console.log("");

let hasGaps = false;

const rows: { id: string; src: number; test: number; status: string }[] = [];

for (const id of reqIds) {
  const refs = allRefs.get(id) ?? [];
  const srcRefs = refs.filter((r) => isSourceFile(r.file));
  const testRefs = refs.filter((r) => isTestFile(r.file));

  let status: string;
  if (srcRefs.length === 0) {
    status = "MISSING (no source)";
    hasGaps = true;
  } else if (testRefs.length === 0) {
    status = "WARN (no tests)";
  } else {
    status = "OK";
  }

  rows.push({ id, src: srcRefs.length, test: testRefs.length, status });
}

// Print table
const idWidth = Math.max(14, ...rows.map((r) => r.id.length));
const header = `${"ID".padEnd(idWidth)}  ${"Src".padStart(4)}  ${"Test".padStart(4)}  Status`;
console.log(header);
console.log("-".repeat(header.length));

for (const row of rows) {
  const icon = row.status === "OK" ? "✓" : row.status.startsWith("WARN") ? "⚠" : "✗";
  console.log(
    `${row.id.padEnd(idWidth)}  ${String(row.src).padStart(4)}  ${String(row.test).padStart(4)}  ${icon} ${row.status}`
  );
}

// Summary
const okCount = rows.filter((r) => r.status === "OK").length;
const warnCount = rows.filter((r) => r.status.startsWith("WARN")).length;
const missingCount = rows.filter((r) => r.status.startsWith("MISSING")).length;

console.log("");
console.log(`Coverage: ${okCount}/${reqIds.length} fully traced (${Math.round((okCount / reqIds.length) * 100)}%)`);
if (warnCount > 0) console.log(`Warnings: ${warnCount} requirements without tests`);
if (missingCount > 0) console.log(`Gaps: ${missingCount} requirements with no source reference`);

// Orphan refs (IDs found in code but not in requirements.yaml)
const reqIdSet = new Set(reqIds);
const orphanIds = [...allRefs.keys()].filter((id) => !reqIdSet.has(id));
if (orphanIds.length > 0) {
  console.log(`\nOrphan @req tags (not in requirements.yaml): ${orphanIds.join(", ")}`);
}

if (hasGaps) {
  console.log("\nFAILED: Some requirements have no source reference.");
  process.exit(1);
} else {
  console.log("\nPASSED: All requirements have source references.");
  process.exit(0);
}
