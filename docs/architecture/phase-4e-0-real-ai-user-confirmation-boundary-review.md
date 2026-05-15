# Phase 4E-0｜Real AI user confirmation boundary review

## 1. Phase objective

Phase 4E-0 defines the product, privacy, and architecture boundary for user confirmation before any real AI provider call.

This phase only writes a boundary review document.

It does not implement:

- a confirmation modal
- Compare UI changes
- Settings changes
- AI output persistence
- AI history
- localStorage keys
- real DeepSeek success testing
- browser regression with a real provider
- prompt changes
- provider changes
- route changes

## 2. Current baseline

The latest stable baseline before this phase is:

- 1da64d0 docs: close real ai route smoke test phase

Confirmed before entering this phase:

- git status clean
- npm.cmd run build passed
- HEAD is contained in origin/main

The previous phase confirmed:

- default mock path works
- DeepSeek missing-config path safely returns missing_provider_configuration
- no real DeepSeek success test has been performed
- no DeepSeek API account or key is currently available

## 3. Why user confirmation is required

HouseFolio handles rental decision data that may be sensitive even after redaction.

Potentially sensitive categories include:

- candidate listing location clues
- commute anchors
- commute pressure
- subjective viewing impressions
- personal preference signals
- notes-derived summaries
- photo existence metadata
- rental budget and area preferences

Even if the current AI input is redacted and allowlisted, the product should make the third-party model call explicit before sending data outside the browser/session context.

The confirmation boundary is required because HouseFolio's L3 layer may call a third-party model provider, while the user should understand:

- what is being sent
- what is not being sent
- that the output is only auxiliary
- that the output does not replace personal verification
- that the output is not a system recommendation
- that the first implementation does not persist the AI output

## 4. Product boundary

The confirmation step should be user-triggered.

Allowed flow:

1. User selects 2-4 listings in Portfolio.
2. User opens Compare.
3. User reviews L2 comparison table and static explanation.
4. User clicks an AI explanation button.
5. HouseFolio shows a confirmation notice before any real provider call.
6. User confirms.
7. The API route sends only redacted allowlisted structured input.
8. The AI output is rendered in the current session.
9. Refreshing the page clears the output.

Not allowed:

- automatic AI call on page load
- background AI analysis
- batch AI calls for all listings
- AI call before the user sees a confirmation notice
- persistent AI output in the first version
- hidden transmission of notes, addresses, photos, coordinates, or raw route data
- presenting the AI result as final recommendation

## 5. Confirmation notice content

The confirmation notice should tell the user that the AI call will send a redacted structured summary of selected listings to a third-party model service.

The notice should state that the sent data may include:

- listing display title
- rent
- area
- layout
- district or area label
- commute minutes
- commute source
- life-circle score
- reference score
- score summary
- subjective rating summary
- strengths
- weaknesses
- neutral facts
- missing field markers
- risk flag markers
- whether notes exist
- whether photos exist
- photo count

The notice should state that the sent data must not include:

- full address
- precise door number
- room number
- building number
- unit number
- latitude or longitude
- raw Amap route JSON
- request URL
- polyline
- route steps
- API key
- full note text
- phone number
- WeChat ID
- ID card number
- contract text
- landlord name
- agent name
- photo blob
- video blob
- object URL
- image base64
- AI prompt raw text displayed to the user
- AI raw provider response

## 6. Suggested Chinese confirmation copy

Suggested title:

    发送给 AI 前请确认

Suggested body:

    本次 AI 辅助解释会将已选房源的脱敏结构化摘要发送给第三方大模型服务商，用于生成对比说明、取舍提示和看房 checklist。

    可能发送的信息包括：租金、面积、户型、区县或商圈、参考通勤时间、参考评分、主观评分摘要、资料完整度和风险标记。

    不会发送完整地址、门牌号、经纬度、高德原始路线、完整笔记原文、手机号、微信号、身份证号、合同内容、房东或中介姓名、照片或视频文件。

    AI 输出仅用于辅助比较，不代表系统推荐或最终决定。请你结合实地看房、合同条款和个人硬性条件自行判断。

Suggested confirm button:

    确认并生成 AI 辅助解释

Suggested cancel button:

    暂不发送

## 7. L3 role boundary

The AI output may:

- summarize L2 comparison results
- explain tradeoffs
- explain commute pressure
- explain risk flags
- explain missing fields
- generate a viewing checklist
- translate structured signals into human-readable language

The AI output must not:

- score listings
- rank listings
- filter listings
- decide for the user
- verify listing authenticity
- claim one listing is the best
- claim the system recommends a listing
- say the user should choose a listing
- override hard constraints
- infer sensitive personal identity or lifestyle profile

Forbidden wording includes:

- 最佳房源
- 最优选择
- 系统推荐
- 推荐分
- 替你决定
- 真房源
- 避坑保真

Preferred wording includes:

- 辅助解释
- 辅助比较
- 参考信息
- 取舍提示
- 不代表最终推荐
- 请自行核实
- 可根据硬性条件一票否决

## 8. Data persistence boundary

The first real AI confirmation implementation should keep AI output session-only.

It should not add:

- housefolio:ai-output
- housefolio:ai-history
- housefolio:compare-ai-history
- housefolio:last-ai-explanation
- housefolio:ai-consent
- housefolio:ai-settings

Reason:

- session-only output keeps Phase 4E small
- no AI artifact persistence means Settings does not need export/delete coverage yet
- no new localStorage key avoids expanding data rights maintenance
- AI data rights can be added later only if AI artifacts become persistent

If a future phase persists AI artifacts, it must first update:

- Settings data rights UI
- local data export
- local data import
- local data clearing
- privacy documentation
- AI artifact deletion behavior

## 9. Settings boundary

Phase 4E-0 does not require Settings changes.

Settings only needs an AI data section if HouseFolio persists AI artifacts.

Since the next implementation should remain session-only, Settings should not be modified yet.

## 10. Architecture boundary

The user confirmation UI should call the existing API route only after confirmation.

The page or component must not:

- call DeepSeek directly
- read DEEPSEEK_API_KEY
- use NEXT_PUBLIC_DEEPSEEK_API_KEY
- build provider-specific request bodies
- persist provider output
- store raw prompt or raw response

The allowed direction remains:

    Compare UI
    → user confirmation
    → redacted CompareExplanationInput
    → /api/ai/compare-explanation
    → provider selected on server
    → session-only rendered output

## 11. Implementation recommendation after this phase

The next implementation phase should be small.

Recommended next phase:

- Phase 4E-1: Real AI confirmation UI plan

Phase 4E-1 should still be a plan document.

Only after that should implementation begin:

- Phase 4E-2: minimal confirmation UI implementation

The first implementation should:

- reuse current Compare AI trigger block
- show a confirmation panel or modal before calling the route
- keep output session-only
- keep mock path usable
- not require a real DeepSeek key
- not modify Settings
- not persist AI output

## 12. Validation standard for this phase

This phase is complete when:

- the boundary review document exists
- npm.cmd run build passes
- git status is clean after commit
- the commit is pushed to origin/main

Expected commit message:

- docs: review real ai confirmation boundary