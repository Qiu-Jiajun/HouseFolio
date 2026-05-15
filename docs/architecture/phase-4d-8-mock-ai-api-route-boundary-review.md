# Phase 4D-8：Mock AI API route boundary review

## 0. Review status

This document records the boundary review for the future Mock AI API route.

Current startup check result before writing this document:

- Git branch: main
- Working tree: clean
- Latest stable commit: 41a9f1b fix: split comparison type imports
- 41a9f1b is contained in origin/main
- npm.cmd run build passed
- src/app/api/ai does not exist

Phase 4D-8 is documentation-only.

This phase does not:

- add an API route
- create src/app/api/ai
- connect DeepSeek
- write a real prompt
- change /compare UI
- add a localStorage key
- change Settings
- modify src code

## 1. Why this boundary review exists

HouseFolio has already built the following AI-adjacent layers:

- AI compare explanation type scaffold
- redacted compare explanation input builder
- mock AI compare explanation provider
- mock provider regression checkpoint

The next engineering step will likely be a Mock AI API route. Before adding that route, the project needs a strict boundary document because an API route can easily become a hidden shortcut for:

- passing raw comparison data
- echoing sensitive input
- leaking provider internals
- preparing a real model prompt too early
- coupling /compare UI directly to a provider
- creating premature persistence for AI outputs
- treating L3 as a recommender rather than an explanation layer

The route must remain a thin server boundary over lib/ai. It must not become product logic, scoring logic, ranking logic, or a prompt laboratory.

## 2. Current phase position

Current HouseFolio phase chain:

- Phase 4A: L2 comparison model layer
- Phase 4B: Compare UI main chain
- Phase 4C: Static L3-facing compare explanation surface
- Phase 4D-0: Real AI provider boundary review
- Phase 4D-1: AI provider implementation plan
- Phase 4D-2: AI compare explanation type scaffold
- Phase 4D-3: Redacted input builder review
- Phase 4D-4: Redacted input builder implementation
- Phase 4D-5: Mock AI provider boundary review
- Phase 4D-6: Mock AI provider implementation
- Phase 4D-7: Mock AI provider regression checkpoint
- Phase 4D-7 startup fix: split comparison type imports
- Phase 4D-8: Mock AI API route boundary review

Phase 4D-8 only defines the boundary for a future route. It does not implement the route.

## 3. Future route candidate

The future implementation may use a route similar to:

    src/app/api/ai/compare-explanation/route.ts

Possible route path:

    POST /api/ai/compare-explanation

This is only a candidate path for future implementation. Phase 4D-8 does not create it.

## 4. Route purpose

The future Mock AI API route should do only one thing:

Receive already-redacted, structured compare explanation input from the client, call the mock provider through lib/ai, and return a structured CompareExplanationOutput.

It should act as a provider boundary, not as a decision engine.

The route may support later replacement of the mock provider with a real provider, but it must not contain DeepSeek-specific code in the mock phase.

## 5. Correct architecture boundary

The route should follow this dependency direction:

    /compare UI
    -> redacted CompareExplanationInput
    -> POST /api/ai/compare-explanation
    -> lib/ai provider boundary
    -> mock provider
    -> CompareExplanationOutput
    -> /compare UI session-only display

The route must not call:

- lib/lbs
- 高德 provider
- localStorage
- IndexedDB
- Supabase
- storage provider
- photo provider
- comparison scoring functions that mutate or recompute scores
- any real model API in the mock phase

The route must not bypass lib/ai.

## 6. Request boundary

The future route may accept only redacted, structured AI explanation input.

Allowed request shape should be based on existing AI compare explanation types, especially:

- CompareExplanationInput
- CompareExplanationListingInput
- CompareExplanationScoreSummary
- CompareExplanationSubjectiveSummary
- CompareExplanationMissingField
- CompareExplanationRiskFlag

The request should include only fields needed for explanation, such as:

- locale
- selected listing count
- listing id
- listing title or short label
- rent monthly
- area
- layout
- district or area label
- status
- commute summary
- commute source
- reference score summary
- subjective summary
- missing field flags
- risk flags
- non-sensitive strengths / weaknesses / neutral facts
- disclaimer context

The request must not include:

- full note text
- original user notes
- complete address
- door number
- room number
- building number
- unit number
- precise work / study location
- precise commute anchor address
- latitude
- longitude
- coordinate
- origin
- destination
- raw Amap response
- raw route JSON
- request URL
- polyline
- navigation steps
- phone number
- WeChat ID
- ID card number
- landlord name
- agent name
- contract text
- photo Blob
- video Blob
- object URL
- image base64
- thumbnail base64
- IndexedDB key
- AI prompt
- raw model response
- provider API key
- NEXT_PUBLIC AI key
- DeepSeek key

## 7. Request validation policy

The future route should validate the request before calling the provider.

Minimum validation rules:

- method must be POST
- body must be JSON
- selected listings should be 2 to 4
- locale should be an allowed locale
- listing inputs must be array-shaped and bounded
- strings should be length-bounded
- arrays such as risks, missing fields, checklist items, and tradeoff hints should be length-bounded
- unknown or forbidden sensitive keys should be rejected or ignored before provider invocation
- malformed input should produce a generic failure response
- route must not echo the rejected payload back to the client

The route should not rely only on TypeScript types, because API input is runtime data.

## 8. Response boundary

The future route should return a structured output based on CompareExplanationOutput.

Allowed response content:

- summary
- tradeoffs
- commuteNotes
- riskExplanations
- missingFieldNotes
- checklist
- disclaimer
- optional mock/provider metadata only if already represented by the approved type contract

The response must not include:

- raw request payload
- provider internal state
- raw prompt
- raw model response
- API key
- full stack trace
- raw exception message
- sensitive input fields removed during validation
- coordinates
- raw LBS data
- photo or video data
- persistence identifier
- history identifier

The response wording must preserve product positioning:

- auxiliary comparison
- reference only
- does not represent final recommendation
- user must verify and decide

The response must avoid:

- best listing
- system recommendation
- recommended score
- final choice
- truth verification
- guaranteed safe listing
- verified real listing

## 9. Error boundary

Future route errors should be generic and user-safe.

Allowed error behavior:

- return a structured error envelope
- use generic reasons such as invalid_input, provider_unavailable, generation_failed
- avoid exposing underlying provider errors
- avoid exposing stack traces
- avoid exposing environment variable names
- avoid echoing request payload
- avoid logging full request body

The route may log minimal operational metadata during development, such as:

- route invoked
- request validation passed or failed
- selected listing count
- provider type: mock
- duration
- generic error category

It must not log:

- full request body
- notes
- addresses
- commute anchors
- AI prompt
- AI response
- photos
- videos
- contact details

## 10. Provider boundary

The future mock API route must call the AI layer through an approved lib/ai function.

Preferred future shape:

    route.ts
    -> generateCompareExplanation(input)
    -> active provider
    -> mock provider in the mock phase

The route should not instantiate provider logic inline.

The route should not import DeepSeek code in the mock phase.

The route should not read a real AI key in the mock phase.

The route should not use NEXT_PUBLIC environment variables.

The route should remain compatible with a later real provider, but it must not pre-implement real provider behavior.

## 11. L1 / L2 / L3 separation

The future route belongs to L3.

It can explain:

- L2 comparison results
- score breakdown implications
- commute tradeoffs already computed by L1 and consumed by L2
- missing fields
- risk flags
- next-step checklist

It cannot compute:

- commute time
- distance
- life circle score
- reference score
- ranking
- filtering
- recommendation
- listing authenticity
- market price truth

L1 remains responsible for spatial calculation.

L2 remains responsible for reference score, comparison model, sorting, filtering, and structured flags.

L3 only explains already-structured and redacted input.

## 12. UI boundary for later phases

Phase 4D-8 does not change /compare UI.

When a future UI trigger is implemented, it should follow these rules:

- user-triggered only
- no automatic generation on page load
- clear AI auxiliary explanation wording
- no persistent output in first version
- output should be session-only unless a later phase explicitly adds persistence
- no Settings change unless AI output persistence or AI data rights are added
- no localStorage key in the first mock API route phase
- no hidden background call

The first UI integration should keep the existing static explanation panel intact until the mock route is proven safe.

## 13. Persistence boundary

The first mock API route phase must be stateless.

It must not write:

- localStorage
- sessionStorage
- IndexedDB
- cookies
- database rows
- AI history
- compare history
- Settings state
- files
- logs containing raw input or raw output

The route response can be rendered by the client as session-only UI state.

Persistence can be reviewed only in a later phase.

## 14. Settings boundary

Phase 4D-8 does not change Settings.

A future mock API route also should not require Settings changes if it remains stateless and session-only.

Settings must be revisited only if the project later adds:

- AI output persistence
- AI history
- AI usage log export
- AI usage log deletion
- provider selection stored locally
- user AI consent records
- cloud sync of AI artifacts

## 15. localStorage boundary

No localStorage key should be added for the mock API route.

Explicitly do not add:

- housefolio:ai-compare-explanations
- housefolio:ai-output-history
- housefolio:compare-ai-history
- housefolio:ai-consent
- housefolio:ai-provider
- housefolio:last-ai-explanation

If a later phase introduces any persistent AI-related key, src/lib/privacy/local-data.ts and Settings export / import / clear behavior must be reviewed together.

## 16. Security and privacy boundary

The route must preserve the local-first posture.

The route may process only the minimum redacted structured fields necessary for explanation.

The route must not convert HouseFolio into:

- a user profiling system
- an AI recommendation system
- a housing authenticity judgment system
- a public data enrichment system
- a cross-user comparison database
- a model prompt collection pipeline

The route must be compatible with future sensitive-data minimization.

## 17. Future implementation acceptance criteria

A future Mock AI API route implementation should pass these checks:

- npm.cmd run build passes
- git status is clean after commit
- src/app/api/ai exists only after the implementation phase, not during Phase 4D-8
- route accepts POST only
- route calls lib/ai provider boundary
- route uses mock provider only
- route does not import DeepSeek
- route does not read real provider keys
- route does not write localStorage, IndexedDB, database, or files
- route does not modify Settings
- route does not modify /compare UI unless that phase explicitly allows UI work
- route does not include prompt construction for a real model
- route does not expose raw errors
- route does not echo request payload
- route response conforms to CompareExplanationOutput
- static scan finds no forbidden sensitive fields in the route response contract

## 18. Suggested next phase

If Phase 4D-8 is accepted, the next safe phase can be:

Phase 4D-9: Mock AI API route minimal implementation

That phase should still avoid:

- DeepSeek
- real prompt builder
- /compare UI trigger
- localStorage persistence
- Settings updates
- AI output history

The only acceptable code target in that future phase should be the minimal server route plus a regression log, unless a separate plan document expands the scope.

## 19. Phase 4D-8 conclusion

A Mock AI API route is reasonable as the next boundary layer because it prepares the architecture for later real-provider integration without exposing provider details to UI code.

However, it must remain a stateless, redacted, server-side, provider-boundary route.

It must not become a shortcut to real AI integration, prompt writing, output persistence, recommendation logic, or Settings expansion.

Phase 4D-8 itself is complete only when this document exists, build passes, git status is reviewed, and the document is committed.