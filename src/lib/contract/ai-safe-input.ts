import type { LegalBasisEntry } from "@/lib/contract/legal-basis";
import type { ContractReviewModel } from "@/lib/contract/review-model";
import type {
  ContractRiskFinding,
  ContractRiskId,
} from "@/lib/contract/types";

export const CONTRACT_REVIEW_AI_INPUT_VERSION =
  "contract-review-ai-safe-v1" as const;

export const CONTRACT_REVIEW_AI_INPUT_LIMITS = {
  maxFindings: 20,
  maxExcerptChars: 360,
  maxLegalBasesPerFinding: 4,
  maxLegalBasisSummaryChars: 240,
  maxRiskSummaryChars: 240,
  maxWhyItMattersChars: 320,
  maxTotalExcerptChars: 6000,
} as const;

export type ContractReviewAiLegalBasisInput = {
  readonly legalBasisId: string;
  readonly legalBasisTitleZh: string;
  readonly legalBasisSummaryZh: string;
  readonly legalBasisSourceType: LegalBasisEntry["sourceLevel"];
};

export type ContractReviewAiFindingInput = {
  readonly riskId: ContractRiskFinding["riskId"];
  readonly riskLevel: ContractRiskFinding["priority"];
  readonly category: ContractRiskFinding["category"];
  readonly ruleTitleZh: string;
  readonly clause: {
    readonly clauseId: ContractRiskFinding["clauseId"];
    readonly clauseOrder: number;
    readonly redactedClauseExcerpt: string;
  };
  readonly riskSummaryZh: string;
  readonly whyItMattersZh: string;
  readonly legalBases: readonly ContractReviewAiLegalBasisInput[];
};

export type ContractReviewAiInput = {
  readonly payloadVersion: typeof CONTRACT_REVIEW_AI_INPUT_VERSION;
  readonly locale: "zh-CN";
  readonly disclaimerMode: "contract-risk-prompt-only";
  readonly findingCount: number;
  readonly findings: readonly ContractReviewAiFindingInput[];
};

type ContractReviewAiRiskMetadata = {
  readonly ruleTitleZh: string;
  readonly whyItMattersZh: string;
};

const contractReviewAiRiskMetadata = {
  policy_clearance_no_compensation: {
    ruleTitleZh: "政策清退、征收或腾退补偿约定需要确认",
    whyItMattersZh:
      "如果租期内因清退、征收、腾退或整治无法继续居住，租客可能突然需要搬离，并承担重新找房、搬家和临时住宿等成本。",
  },
  landlord_entry_without_notice: {
    ruleTitleZh: "出租方进入房屋的通知与同意边界需要确认",
    whyItMattersZh:
      "进入房屋的条件和沟通方式不清，可能影响居住安宁、个人隐私和财物安全。",
  },
  excessive_late_fee_or_auto_termination: {
    ruleTitleZh: "逾期费用或自动解除条件需要确认",
    whyItMattersZh:
      "逾期费用、宽限期和解除条件不清，可能在短期内放大费用负担和履约争议。",
  },
  unclear_deposit_deduction: {
    ruleTitleZh: "押金扣除条件和退还方式需要确认",
    whyItMattersZh:
      "如果没有写清扣除项目、扣除标准和退还时间，退租时容易出现押金返还争议。",
  },
  excessive_early_termination_penalty: {
    ruleTitleZh: "提前退租责任和费用范围需要确认",
    whyItMattersZh:
      "如果因工作变动、房屋问题或其他现实原因提前退租，租客可能承担不明确或过重的费用。",
  },
  repair_responsibility_shifted_to_tenant: {
    ruleTitleZh: "维修责任可能被过度转移给租客",
    whyItMattersZh:
      "如果没有区分自然损耗、主体维修和人为损坏，入住后容易出现维修责任边界不清和额外费用。",
  },
} as const satisfies Readonly<Record<ContractRiskId, ContractReviewAiRiskMetadata>>;

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxChars: number) {
  const normalized = value.trim();

  if (maxChars <= 0) {
    return "";
  }

  if (normalized.length <= maxChars) {
    return normalized;
  }

  if (maxChars === 1) {
    return "…";
  }

  return `${normalized.slice(0, maxChars - 1).trimEnd()}…`;
}

export function redactContractClauseExcerpt(value: string) {
  return normalizeWhitespace(value)
    .replace(
      /((?:甲方姓名|乙方姓名|出租人姓名|承租人姓名|联系人)\s*[:：]\s*)[\u4e00-\u9fa5·]{2,10}/g,
      "$1[姓名已脱敏]",
    )
    .replace(
      /((?:微信号?|wxid|QQ号?|联系方式)\s*[:：]\s*)[A-Za-z0-9_-]{4,40}/gi,
      "$1[联系方式已脱敏]",
    )
    .replace(
      /((?:合同编号|协议编号|合同号|协议号)\s*[:：]\s*)[A-Za-z0-9_\-./（）()]+/g,
      "$1[合同编号已脱敏]",
    )
    .replace(
      /((?:不动产权证号|房产证号|产权证号|权证编号)\s*[:：]\s*)[^，。；;\s]{2,80}/g,
      "$1[权证编号已脱敏]",
    )
    .replace(
      /((?:房屋地址|出租房屋地址|租赁房屋地址|详细地址|地址)\s*[:：]\s*)[^，。；;]{4,120}/g,
      "$1[房屋地址已脱敏]",
    )
    .replace(
      /((?:收款账户|收款账号|支付宝账号?|银行账号?)\s*[:：]\s*)[A-Za-z0-9_@.\-]+/g,
      "$1[账号信息已脱敏]",
    )
    .replace(
      /((?:甲方签字|乙方签字|出租人签字|承租人签字|签字)\s*[:：]\s*)[^，。；;\s]{1,40}/g,
      "$1[签字信息已脱敏]",
    )
    .replace(
      /\d+\s*(?:号楼|栋|幢)\s*\d+\s*单元\s*\d+\s*(?:室|房间号)/g,
      "[房屋地址已脱敏]",
    )
    .replace(
      /\d+\s*单元\s*\d+\s*(?:室|房间号)/g,
      "[房屋地址已脱敏]",
    )
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[邮箱已脱敏]")
    .replace(/(^|[^\d])\d{17}[\dXx](?!\d)/g, "$1[身份证号已脱敏]")
    .replace(/(^|[^\d])1[3-9]\d{9}(?!\d)/g, "$1[手机号已脱敏]")
    .replace(/(^|[^\d])\d{12,19}(?!\d)/g, "$1[银行卡号已脱敏]");
}

function createLegalBasisInput(
  entry: LegalBasisEntry,
): ContractReviewAiLegalBasisInput {
  return {
    legalBasisId: entry.id,
    legalBasisTitleZh: entry.title,
    legalBasisSummaryZh: truncateText(
      entry.shortSummary,
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasisSummaryChars,
    ),
    legalBasisSourceType: entry.sourceLevel,
  };
}

function buildLegalBasesForFinding(
  finding: ContractRiskFinding,
  legalBasisById: ReadonlyMap<string, LegalBasisEntry>,
) {
  const seen = new Set<string>();
  const legalBases: ContractReviewAiLegalBasisInput[] = [];

  for (const legalBasisId of finding.legalBasisIds) {
    if (
      legalBases.length >=
      CONTRACT_REVIEW_AI_INPUT_LIMITS.maxLegalBasesPerFinding
    ) {
      break;
    }

    if (seen.has(legalBasisId)) {
      continue;
    }

    const entry = legalBasisById.get(legalBasisId);

    if (!entry) {
      continue;
    }

    seen.add(legalBasisId);
    legalBases.push(createLegalBasisInput(entry));
  }

  return legalBases;
}

export function buildContractReviewAiInput(
  model: ContractReviewModel,
): ContractReviewAiInput {
  const clauseById = new Map(
    model.clauses.map((clause) => [clause.id, clause]),
  );
  const legalBasisById = new Map(
    model.legalBasisEntries.map((entry) => [entry.id, entry]),
  );

  let totalExcerptChars = 0;

  const findings = model.findings
    .slice(0, CONTRACT_REVIEW_AI_INPUT_LIMITS.maxFindings)
    .map((finding) => {
      const clause = clauseById.get(finding.clauseId);
      const remainingExcerptChars = Math.max(
        0,
        CONTRACT_REVIEW_AI_INPUT_LIMITS.maxTotalExcerptChars -
          totalExcerptChars,
      );
      const excerptLimit = Math.min(
        CONTRACT_REVIEW_AI_INPUT_LIMITS.maxExcerptChars,
        remainingExcerptChars,
      );
      const redactedClauseExcerpt = truncateText(
        redactContractClauseExcerpt(clause?.text ?? ""),
        excerptLimit,
      );

      totalExcerptChars += redactedClauseExcerpt.length;

      const metadata = contractReviewAiRiskMetadata[finding.riskId];

      return {
        riskId: finding.riskId,
        riskLevel: finding.priority,
        category: finding.category,
        ruleTitleZh: metadata.ruleTitleZh,
        clause: {
          clauseId: finding.clauseId,
          clauseOrder: finding.clauseIndex + 1,
          redactedClauseExcerpt,
        },
        riskSummaryZh: truncateText(
          finding.ruleReason,
          CONTRACT_REVIEW_AI_INPUT_LIMITS.maxRiskSummaryChars,
        ),
        whyItMattersZh: truncateText(
          metadata.whyItMattersZh,
          CONTRACT_REVIEW_AI_INPUT_LIMITS.maxWhyItMattersChars,
        ),
        legalBases: buildLegalBasesForFinding(finding, legalBasisById),
      };
    });

  return {
    payloadVersion: CONTRACT_REVIEW_AI_INPUT_VERSION,
    locale: "zh-CN",
    disclaimerMode: "contract-risk-prompt-only",
    findingCount: findings.length,
    findings,
  };
}
