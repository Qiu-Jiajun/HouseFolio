# Phase 4E-1｜Real AI confirmation UI plan

## 1. Phase objective

Phase 4E-1 plans the minimal user confirmation UI before any real AI provider call.

This phase only writes an implementation plan document.

It does not implement:

- confirmation modal
- confirmation panel
- Compare UI changes
- Settings changes
- localStorage keys
- AI output persistence
- AI history
- real DeepSeek success test
- real provider browser regression
- prompt changes
- provider changes
- route changes

## 2. Current baseline

Latest stable baseline:

- b6a406c docs: review real ai confirmation boundary

Confirmed status before this phase:

- npm.cmd run build passed
- git status clean
- HEAD = origin/main = origin/HEAD = b6a406c

Previous phases confirmed:

- default mock path works
- DeepSeek missing-config path safely returns missing_provider_configuration
- real AI user confirmation boundary has been reviewed
- no real DeepSeek success test has been performed
- no AI output is persisted

## 3. Implementation target for the next coding phase

The next implementation phase should add a minimal confirmation step before calling the existing AI compare explanation route.

The first implementation should preserve the current architecture:

    Compare UI
    → user clicks AI explanation trigger
    → confirmation UI appears
    → user confirms
    → existing /api/ai/compare-explanation route is called
    → AI output renders in current session only

The implementation must not change:

- provider selection logic
- API route behavior
- prompt builder
- DeepSeek provider
- Settings
- localStorage
- AI output persistence

## 4. UI placement

Recommended placement:

- inside the existing Compare AI trigger block
- near the current AI explanation button
- below the static compare explanation panel and comparison table context

Reason:

- the user should first see L2 comparison results
- the user should understand AI is only an explanation layer
- the confirmation is contextual to the current selected listings

Avoid:

- global modal detached from Compare context
- automatic pop-up on page load
- hidden confirmation in Settings
- confirmation before the user selects listings

## 5. Interaction flow

Recommended flow:

1. User opens /compare?ids=...
2. Compare table renders.
3. Static explanation renders.
4. AI trigger block shows a button such as "生成 AI 辅助解释".
5. User clicks the button.
6. Confirmation panel appears.
7. User reads what will and will not be sent.
8. User clicks "确认并生成 AI 辅助解释".
9. Existing API request is sent.
10. Loading state appears.
11. Output renders in session.
12. Refreshing the page clears the output.

Cancel flow:

1. User clicks "暂不发送".
2. Confirmation panel closes.
3. No API request is sent.
4. No output is generated.
5. No state is persisted.

Error flow:

1. User confirms.
2. Route returns a safe error.
3. UI displays a safe message.
4. UI must not display raw provider errors.
5. UI must not expose provider URLs, keys, raw response, prompt, or stack traces.

## 6. Minimal state model

The implementation should use component state only.

Suggested state:

- confirmationVisible: boolean
- isGenerating: boolean
- output: CompareExplanationOutput | null
- errorMessage: string | null

Do not add:

- localStorage state
- sessionStorage state
- URL query state
- IndexedDB state
- persisted consent state
- AI history state

Reason:

- the first version is session-only
- user confirmation should apply to each explicit call
- no persisted AI artifact means no Settings data-rights expansion

## 7. Confirmation copy source

User-facing copy should be centralized in:

- src/content/zh-cn.ts

The implementation should avoid large hardcoded Chinese strings inside TSX.

Suggested content keys may be grouped under an existing compare AI section, for example:

- compare.aiConfirmation.title
- compare.aiConfirmation.body
- compare.aiConfirmation.sentDataIntro
- compare.aiConfirmation.notSentDataIntro
- compare.aiConfirmation.sentDataItems
- compare.aiConfirmation.notSentDataItems
- compare.aiConfirmation.disclaimer
- compare.aiConfirmation.confirmButton
- compare.aiConfirmation.cancelButton

The exact key shape can be adjusted to match the existing zhCN structure.

## 8. Suggested confirmation content

Title:

    发送给 AI 前请确认

Body:

    本次 AI 辅助解释会将已选房源的脱敏结构化摘要发送给第三方大模型服务商，用于生成对比说明、取舍提示和看房 checklist。

May send:

- 租金
- 面积
- 户型
- 区县或商圈
- 参考通勤时间
- 参考评分
- 主观评分摘要
- 资料完整度
- 风险标记

Will not send:

- 完整地址
- 门牌号
- 经纬度
- 高德原始路线
- 完整笔记原文
- 手机号
- 微信号
- 身份证号
- 合同内容
- 房东或中介姓名
- 照片或视频文件

Disclaimer:

    AI 输出仅用于辅助比较，不代表系统推荐或最终决定。请你结合实地看房、合同条款和个人硬性条件自行判断。

Confirm button:

    确认并生成 AI 辅助解释

Cancel button:

    暂不发送

## 9. Component boundary

Preferred approach:

- reuse the existing Compare AI trigger component/block
- add an inline confirmation panel before the request is sent

Avoid creating a large abstraction too early.

Do not create:

- global AI consent provider
- persistent consent store
- Settings-level AI preferences
- AI history manager
- reusable modal framework

Reason:

- the current phase should remain small
- this is still a route-level and compare-level AI feature
- no AI artifact persistence exists yet

## 10. API boundary

The UI should continue using:

- /api/ai/compare-explanation

The UI must not:

- call DeepSeek directly
- read DEEPSEEK_API_KEY
- use NEXT_PUBLIC_DEEPSEEK_API_KEY
- construct provider-specific payloads
- store raw prompt
- store raw response
- expose request URL
- expose provider error internals

The request body should remain:

- CompareExplanationInput

The input should continue to be built from the existing redacted input builder / allowlisted shape.

## 11. Copy and compliance wording

Preferred wording:

- AI 辅助解释
- 辅助比较
- 参考信息
- 取舍提示
- 不代表最终推荐
- 请自行核实
- 可根据硬性条件一票否决

Forbidden wording:

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真

## 12. Validation standard for the future implementation

The future implementation should be validated by:

1. npm.cmd run build
2. git status
3. Browser check using mock/default path
4. Confirm no AI output persists after refresh
5. Confirm no new AI localStorage key
6. Confirm Settings unchanged
7. Confirm clicking cancel does not call the API
8. Confirm clicking confirm calls the existing route
9. Confirm safe missing-config error displays without leaking sensitive markers

Suggested localStorage check:

    Object.keys(localStorage).filter((key) => key.toLowerCase().includes("ai"))

Expected result:

    []

## 13. Future phase recommendation

Recommended next phase:

- Phase 4E-2: Minimal real AI confirmation UI implementation

Phase 4E-2 should:

- modify only the minimal Compare AI trigger-related component
- update zh-cn copy
- keep output session-only
- keep mock path usable
- not require a real DeepSeek key
- not modify Settings
- not add localStorage keys
- not persist AI output

Do not jump directly to:

- real DeepSeek success browser regression
- AI history
- Settings AI data rights
- persisted AI artifacts
- cost/rate control
- public launch readiness