# Phase 11A Source Map and Canonical Viewing Record Design

## Existing Canonical Source Map

The existing primary listing key is:

```
Listing.id
```

Related local records should use:

```
listingId
```

Existing reusable authorities:

* `Listing`
* `housefolio:listing-status-overrides`
* `housefolio:listing-notes`
* `housefolio:listing-ratings`
* `housefolio:commute-results`
* IndexedDB photo provider

Existing subjective ratings:

* `light`
* `quiet`
* `decoration`

These sources remain canonical for their current data domains. Phase 11 must extend them with viewing-process data instead of duplicating listing data.

## Missing Viewing-Process Fields

The current product model does not yet have these viewing-process fields:

* `expectedRating`
* `overallRating`
* `preVisitMemo`
* `postVisitImpression`
* `viewedAt`
* viewing record `updatedAt`

## Navigation Issue

The homepage `看房记录` entry currently links incorrectly to:

```
/portfolio
```

`AppNav` currently does not contain:

```
/viewing-log
```

Phase 11 implementation should correct the navigation so the viewing-log entry points to the dedicated route.

## Canonical Extension Decision

Add a dedicated viewing-process record type:

```ts
type ListingViewingRecord = {
  listingId: string;
  expectedRating?: number;
  overallRating?: number;
  preVisitMemo?: string;
  postVisitImpression?: string;
  viewedAt?: string;
  updatedAt: string;
};
```

Recommended localStorage key:

```
housefolio:listing-viewing-records
```

`ListingViewingRecord` is not a second listing database. It only stores viewing-process incremental fields.

It must not duplicate:

* `title`
* `rent`
* `address`
* `district`
* `photos`
* `commute`
* `status`
* general notes
* `light`
* `quiet`
* `decoration`

Listing identity, display facts, photos, commute results, status, general notes, and existing subjective ratings continue to come from their existing canonical authorities.

## Shared UI Requirement

`/portfolio/[id]` must display and edit the same `ListingViewingRecord`.

`/viewing-log` must read and edit the same `ListingViewingRecord` through shared business-layer functions.

Forbidden patterns:

* two copies of viewing data synchronized between pages;
* direct page-level localStorage manipulation;
* a viewing-log-only data script;
* a route-specific data fork that cannot be surfaced in `/portfolio/[id]`.

Any field shown or edited in the `/viewing-log` drawer must also surface in `/portfolio/[id]`.

## Settings Requirement

The new key must be included in:

* Settings view;
* JSON export;
* JSON import;
* local clear.

This is required because the viewing-process record is user-authored local data.

## System Score Boundary

`/viewing-log` must not display:

* `compositeScore`
* `ScoreBreakdown`
* system star ratings
* recommendation star ratings

The route should show user-entered viewing intent and viewing outcome only:

* unviewed listing: `期待值`
* viewed listing: `总体评分`

The two ratings are independent and must be preserved separately.

## Viewed and Excluded Boundary

`已排除` does not imply `已看房`.

`已看房` should be represented by an explicit marker or timestamp, preferably `viewedAt`.

Status overrides remain responsible for listing status. Viewing records remain responsible for viewing-process facts.

## Implemented Viewing Time Semantics

The implemented viewing-process record separates planned viewing time from completed viewing time:

```ts
plannedViewingAt?: string; // 预计看房时间
viewedAt?: string; // 实际完成看房时间
```

`plannedViewingAt` is scheduling intent only. Editing `plannedViewingAt` does not mean that the user has completed a viewing.

`plannedViewingAt` must not:

* change listing status;
* write to `viewedAt`;
* imply that a listing has been viewed.

`viewedAt` is the explicit completed-viewing marker. When the user actively switches a listing to the viewed group and `viewedAt` is empty, the UI may generate a default current local minute timestamp.

When the user switches a listing back to the pending-viewing group:

* clear `viewedAt`;
* preserve `plannedViewingAt`.

When the user switches a listing to the rejected group:

* preserve `plannedViewingAt`;
* preserve `viewedAt`;
* do not fabricate a completed viewing time.

## Implemented Rating Semantics

`/viewing-log` shows only user-authored ratings.

Pending-viewing cards show:

```ts
expectedRating?: number; // 用户填写的期待值
```

The pending-viewing card UI uses hearts for `expectedRating`.

Viewed cards show:

```ts
overallRating?: number; // 用户填写的总体评分
```

The viewed card UI uses stars for `overallRating`.

Rejected cards hide the rating control in the card surface, but rejecting a listing must not delete historical rating values from the underlying viewing record.

Persisted rating values are restricted to integer values from `1` through `5`.

Clearing a rating or leaving a listing unrated is represented as:

```ts
undefined
```

Do not persist `0` as an unrated sentinel.

## Implemented Memo Display Semantics

In `/viewing-log`, `memo` / `提醒或感受` is the primary card reading surface for viewing workflow notes.

Card behavior:

* default state: compact display of approximately three lines;
* click or focus: expand to show the full text;
* expanded state: textarea grows automatically to match content height;
* blur: save through the existing shared viewing-record logic;
* collapse: restore the compact display.

Memo routing is unchanged:

```ts
if (!viewedAt) {
  // preVisitMemo
}

if (viewedAt) {
  // postVisitImpression
}
```

No route-specific memo fork should be introduced.

## Implemented Card Layout Priority

The `/viewing-log` card layout follows this display priority:

1. listing title, address, viewing status, decision label, and user rating;
2. `memo` / `提醒或感受`;
3. viewing time;
4. rent and commute summary.

On desktop, the memo card is the main content region and uses the wider flexible column.

Rent and commute remain visible, but they are visually downgraded to compact summary metrics. They should not occupy large empty panels or compete with memo as the primary reading area.

On mobile, the content naturally stacks vertically. Memo remains prioritized and all memo controls work by click or focus, not hover.

## Implemented Datetime Overlay Semantics

The viewing-time picker is a local card overlay.

When a time picker is open:

* the current card raises its stacking level;
* the picker overlay uses a higher `z-index`;
* required parent containers allow `overflow-visible`;
* the overlay should not be covered by following listing cards;
* the mobile overlay is constrained by viewport width.

This keeps the date and minute-level time controls usable inside grouped viewing-log cards.

## Phase 11D-9 Browser Regression Closeout

Phase 11D-9 local browser regression:

```txt
PASS
```

Manual local browser validation covered:

* homepage and navigation to `/viewing-log`;
* pending-viewing expected rating;
* viewed overall rating;
* rejected listing semantics;
* separation of `plannedViewingAt` and `viewedAt`;
* preservation of shortlisted status;
* datetime overlay stacking above following cards;
* memo expand, collapse, blur-save, and refresh persistence;
* `/portfolio/[id]` bidirectional synchronization;
* Settings data-rights coverage;
* `/demo` readability;
* basic 390px mobile usability.

## Next Implementation Recommendation

Phase 11B-C can prioritize one cohesive implementation module because:

* canonical authority is clear;
* no new external dependency is required;
* the photo provider can be reused;
* the commute authority can be reused;
* the status authority can be reused;
* Settings data-rights entry points are clear;
* OCR worktree isolation is established.

Keep the module scoped to the viewing-record business layer, `/portfolio/[id]` surfacing, `/viewing-log` projection, navigation correction, and Settings data-rights coverage.
