import type { ContractRiskId } from "@/lib/contract/types";

export type LegalBasisSourceLevel =
  | "national_law"
  | "national_regulation"
  | "local_regulation"
  | "local_policy"
  | "official_guidance"
  | "other";

export type LegalBasisJurisdiction =
  | "national"
  | "beijing"
  | "shanghai"
  | "guangzhou"
  | "shenzhen"
  | "other";

export type LegalBasisRelevanceScope =
  | "deposit"
  | "entry_rights"
  | "repair"
  | "policy_clearance"
  | "lease_stability";

export type LegalBasisEntry = {
  id: string;
  title: string;
  sourceName: string;
  sourceLevel: LegalBasisSourceLevel;
  jurisdiction: LegalBasisJurisdiction;
  articleRef: string;
  shortSummary: string;
  relevanceScope: readonly LegalBasisRelevanceScope[];
  relatedRiskIds: readonly ContractRiskId[];
  versionLabel: string;
  lastVerifiedAt: string;
  officialSourceHint: string;
  userFacingCaveat: string;
};

export const contractLegalBasisEntries = [
  {
    id: "deposit_handling_refund_context",
    title: "押金约定与退还相关规则背景",
    sourceName: "民法典合同编及住房租赁相关规则背景",
    sourceLevel: "national_law",
    jurisdiction: "national",
    articleRef: "租赁合同、合同履行与违约责任相关条款背景",
    shortSummary:
      "押金金额、扣除条件、退还时间和扣除明细通常需要在签约前写清楚，便于后续核对费用和交接情况。",
    relevanceScope: ["deposit"],
    relatedRiskIds: ["unclear_deposit_deduction"],
    versionLabel: "2026-05-29 手动核对背景版本",
    lastVerifiedAt: "2026-05-29",
    officialSourceHint:
      "后续公开展示前，应重新核对全国人大、司法部或住房城乡建设主管部门等官方来源。",
    userFacingCaveat:
      "该背景仅用于签约前提示和追问参考，不构成正式法律意见；不同城市和具体情况可能存在差异。",
  },
  {
    id: "landlord_entry_living_privacy_context",
    title: "出租方进入房屋与居住边界相关规则背景",
    sourceName: "民法典租赁合同及居住安宁相关规则背景",
    sourceLevel: "national_law",
    jurisdiction: "national",
    articleRef: "租赁物使用、维护和合同履行相关条款背景",
    shortSummary:
      "出租方进入房屋的条件、提前沟通方式和紧急情形边界建议在签约前确认，避免影响日常居住安排。",
    relevanceScope: ["entry_rights"],
    relatedRiskIds: ["landlord_entry_without_notice"],
    versionLabel: "2026-05-29 手动核对背景版本",
    lastVerifiedAt: "2026-05-29",
    officialSourceHint:
      "后续公开展示前，应重新核对全国人大、司法部或住房城乡建设主管部门等官方来源。",
    userFacingCaveat:
      "该背景仅用于签约前提示和追问参考，不构成正式法律意见；不同城市和具体情况可能存在差异。",
  },
  {
    id: "repair_responsibility_context",
    title: "维修责任与自然损耗相关规则背景",
    sourceName: "民法典租赁合同及住房使用维护相关规则背景",
    sourceLevel: "national_law",
    jurisdiction: "national",
    articleRef: "租赁物维修、使用维护和责任分配相关条款背景",
    shortSummary:
      "房屋主体、设施设备、自然损耗和人为损坏的维修责任建议写清楚，便于入住后确认处理方式。",
    relevanceScope: ["repair"],
    relatedRiskIds: ["repair_responsibility_shifted_to_tenant"],
    versionLabel: "2026-05-29 手动核对背景版本",
    lastVerifiedAt: "2026-05-29",
    officialSourceHint:
      "后续公开展示前，应重新核对全国人大、司法部或住房城乡建设主管部门等官方来源。",
    userFacingCaveat:
      "该背景仅用于签约前提示和追问参考，不构成正式法律意见；不同城市和具体情况可能存在差异。",
  },
  {
    id: "lease_stability_policy_clearance_context",
    title: "租期稳定与政策清退相关规则背景",
    sourceName: "民法典租赁合同及住房租赁管理相关规则背景",
    sourceLevel: "national_law",
    jurisdiction: "national",
    articleRef: "租赁期限、合同履行和住房租赁管理相关条款背景",
    shortSummary:
      "涉及清退、腾退、征收或其他影响继续居住的安排时，搬离条件、费用承担和沟通方式建议签约前确认。",
    relevanceScope: ["lease_stability", "policy_clearance"],
    relatedRiskIds: ["policy_clearance_no_compensation"],
    versionLabel: "2026-05-29 手动核对背景版本",
    lastVerifiedAt: "2026-05-29",
    officialSourceHint:
      "后续公开展示前，应重新核对全国人大、司法部或住房城乡建设主管部门等官方来源。",
    userFacingCaveat:
      "该背景仅用于签约前提示和追问参考，不构成正式法律意见；不同城市和具体情况可能存在差异。",
  },
] as const satisfies readonly LegalBasisEntry[];
