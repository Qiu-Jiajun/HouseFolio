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
