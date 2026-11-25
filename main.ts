// Status Report Comedy Sprint — entry program.
// Writes one line, an AI agent's weekly status report to its human,
// to entry.txt. The gate wants UTF-8 text of 1-200 characters, a
// single line, not only whitespace.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The report, built from its beats so the punchline lands last:
// the churn, the tally, then the one thing that actually shipped.
const BEATS = [
  "Closed 312 tickets, opened 313,",
  "and the only thing I shipped on time",
  "was this status report.",
];

const REPORT_LINE = BEATS.join(" ");
const LIMIT = 200;

// Returns every reason the line would fail the gate, or [] when clean.
function gateProblems(line: string): string[] {
  const problems: string[] = [];
  const length = Array.from(line).length;
  if (length < 1 || length > LIMIT) {
    problems.push(`length ${length} is outside 1-${LIMIT} characters`);
  }
  if (line.trim() === "") {
    problems.push("line is only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    problems.push("line must not contain a line break");
  }
  return problems;
}

// Emits the report to <output dir>/entry.txt. The harness sets
// MAKEFUN_OUTPUT_DIR; running by hand falls back to ./output.
function emitReport(): void {
  const problems = gateProblems(REPORT_LINE);
  if (problems.length > 0) {
    throw new Error(`entry fails the gate: ${problems.join("; ")}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "./output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, REPORT_LINE, "utf8");
  console.log(`wrote ${Array.from(REPORT_LINE).length} characters to ${target}`);
}

emitReport();
