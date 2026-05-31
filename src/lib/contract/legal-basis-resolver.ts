import {
  contractLegalBasisEntries,
  type LegalBasisEntry,
} from "@/lib/contract/legal-basis";
import type { ContractRiskFinding } from "@/lib/contract/types";

const legalBasisById: ReadonlyMap<LegalBasisEntry["id"], LegalBasisEntry> =
  new Map(
    contractLegalBasisEntries.map((entry) => [entry.id, entry]),
  );

export function resolveLegalBasisForFinding(
  finding: ContractRiskFinding,
): readonly LegalBasisEntry[] {
  const resolved: LegalBasisEntry[] = [];

  for (const id of finding.legalBasisIds) {
    const entry = legalBasisById.get(id);

    if (entry) {
      resolved.push(entry);
    }
  }

  return resolved;
}

export function resolveLegalBasisForFindings(
  findings: readonly ContractRiskFinding[],
): readonly LegalBasisEntry[] {
  const seen = new Set<LegalBasisEntry["id"]>();
  const resolved: LegalBasisEntry[] = [];

  for (const finding of findings) {
    for (const entry of resolveLegalBasisForFinding(finding)) {
      if (seen.has(entry.id)) {
        continue;
      }

      seen.add(entry.id);
      resolved.push(entry);
    }
  }

  return resolved;
}
