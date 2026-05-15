const fs = require("fs");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function replaceOnce(content, search, replacement, label) {
  if (!content.includes(search)) {
    throw new Error(`Missing expected block: ${label}`);
  }

  return content.replace(search, replacement);
}

function replaceRegexOnce(content, pattern, replacement, label) {
  const next = content.replace(pattern, replacement);

  if (next === content) {
    throw new Error(`Missing expected pattern: ${label}`);
  }

  return next;
}

const componentPath = "src/components/compare-selected-listings-panel.tsx";
let component = read(componentPath);

component = replaceOnce(
  component,
  `  const [mockAiError, setMockAiError] = useState<string | null>(null);`,
  `  const [mockAiError, setMockAiError] = useState<string | null>(null);
  const [mockAiConfirmationVisible, setMockAiConfirmationVisible] =
    useState(false);`,
  "mock AI error state",
);

component = replaceRegexOnce(
  component,
  /  async function handleGenerateMockAiExplanation\(\) \{\r?\n    setMockAiStatus\("loading"\);/,
  `  async function handleGenerateMockAiExplanation() {
    setMockAiConfirmationVisible(false);
    setMockAiStatus("loading");`,
  "handleGenerateMockAiExplanation start",
);

component = replaceOnce(
  component,
  `            onClick={handleGenerateMockAiExplanation}`,
  `            onClick={() => {
              setMockAiError(null);
              setMockAiConfirmationVisible(true);
            }}`,
  "mock AI button click handler",
);

component = replaceRegexOnce(
  component,
  /        <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-neutral-500">\r?\n          \{compareMockAiExplanationCopy\.boundaryNote\}\r?\n        <\/p>/,
  `        <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-neutral-500">
          {compareMockAiExplanationCopy.boundaryNote}
        </p>

        {mockAiConfirmationVisible ? (
          <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-5">
            <div className="max-w-3xl">
              <h3 className="text-base font-semibold text-neutral-950">
                {compareMockAiExplanationCopy.confirmation.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {compareMockAiExplanationCopy.confirmation.body}
              </p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl bg-neutral-50 p-4">
                <h4 className="text-sm font-semibold text-neutral-900">
                  {compareMockAiExplanationCopy.confirmation.sentDataTitle}
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
                  {compareMockAiExplanationCopy.confirmation.sentDataItems.map(
                    (item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-neutral-400">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </article>

              <article className="rounded-2xl bg-neutral-50 p-4">
                <h4 className="text-sm font-semibold text-neutral-900">
                  {compareMockAiExplanationCopy.confirmation.notSentDataTitle}
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
                  {compareMockAiExplanationCopy.confirmation.notSentDataItems.map(
                    (item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="text-neutral-400">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </article>
            </div>

            <p className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-500">
              {compareMockAiExplanationCopy.confirmation.disclaimer}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleGenerateMockAiExplanation}
                disabled={mockAiStatus === "loading"}
                className="inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {mockAiStatus === "loading"
                  ? compareMockAiExplanationCopy.loadingAction
                  : compareMockAiExplanationCopy.confirmation.confirmAction}
              </button>

              <button
                type="button"
                onClick={() => setMockAiConfirmationVisible(false)}
                disabled={mockAiStatus === "loading"}
                className="inline-flex rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-500 disabled:cursor-not-allowed disabled:text-neutral-400"
              >
                {compareMockAiExplanationCopy.confirmation.cancelAction}
              </button>
            </div>
          </div>
        ) : null}`,
  "boundary note block",
);

write(componentPath, component);

const zhPath = "src/content/zh-cn.ts";
let zh = read(zhPath);

const newCompareMockAiExplanationCopy = `export const compareMockAiExplanationCopy = {
  badge: "Phase 4E-2｜AI 辅助解释确认",
  title: "AI 辅助解释",
  description:
    "点击后会先展示发送确认说明。确认后，系统会把当前比较结果转换为已脱敏的结构化输入，请求 AI 生成辅助解释；解释结果仍只保留在本次页面会话中。",
  action: "生成 AI 辅助解释",
  loadingAction: "正在生成辅助解释…",
  errorMessage: "暂时无法生成 AI 辅助解释，请稍后重试。",
  boundaryNote:
    "AI 辅助解释基于已脱敏的结构化比较信息生成，仅用于辅助比较，不代表最终推荐，也不判断房源真实性。",
  confirmation: {
    title: "发送给 AI 前请确认",
    body:
      "本次 AI 辅助解释会将已选房源的脱敏结构化摘要发送给第三方大模型服务商，用于生成对比说明、取舍提示和看房 checklist。",
    sentDataTitle: "可能发送的信息",
    sentDataItems: [
      "租金、面积、户型",
      "区县或商圈",
      "参考通勤时间与通勤来源",
      "参考评分与评分摘要",
      "主观评分摘要",
      "资料完整度与风险标记",
      "是否有笔记、是否有照片、照片数量",
    ],
    notSentDataTitle: "不会发送的信息",
    notSentDataItems: [
      "完整地址、门牌号、经纬度",
      "高德原始路线、请求 URL、路线步骤",
      "完整笔记原文、手机号、微信号",
      "身份证号、合同内容、房东或中介姓名",
      "照片或视频文件、图片 base64、object URL",
      "API key、原始 prompt 或模型原始响应",
    ],
    disclaimer:
      "AI 输出仅用于辅助比较，不代表系统推荐或最终决定。请结合实地看房、合同条款和个人硬性条件自行判断。",
    confirmAction: "确认并生成 AI 辅助解释",
    cancelAction: "暂不发送",
  },
  sections: {
    summary: "概览",
    tradeoffs: "取舍说明",
    commuteNotes: "通勤提示",
    riskExplanations: "风险信号解释",
    missingFieldNotes: "待补充字段",
    checklist: "下一步 checklist",
  },
} as const;`;

zh = replaceRegexOnce(
  zh,
  /export const compareMockAiExplanationCopy = \{[\s\S]*?\n\} as const;/,
  newCompareMockAiExplanationCopy,
  "compareMockAiExplanationCopy",
);

write(zhPath, zh);

console.log("Phase 4E-2 files patched.");