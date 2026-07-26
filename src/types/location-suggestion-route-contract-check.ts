import type { LocationSuggestion } from "@/lib/lbs/provider";
import type { LocationSuggestionResponseBody } from "@/types/location-suggestion-route";

type ForbiddenLocationSuggestionKeys =
  | "coordinate"
  | "coordinates"
  | "latitude"
  | "longitude"
  | "location"
  | "raw"
  | "rawResponse"
  | "requestUrl"
  | "url"
  | "apiKey"
  | "key";

type ExtractForbiddenKeys<T> = Extract<
  keyof T,
  ForbiddenLocationSuggestionKeys
>;

type AssertNoForbiddenKeys<T> =
  ExtractForbiddenKeys<T> extends never ? true : never;

const suggestionDoesNotExposeForbiddenKeys: AssertNoForbiddenKeys<LocationSuggestion> =
  true;
const responseDoesNotExposeForbiddenTopLevelKeys: AssertNoForbiddenKeys<LocationSuggestionResponseBody> =
  true;

void suggestionDoesNotExposeForbiddenKeys;
void responseDoesNotExposeForbiddenTopLevelKeys;
