import type { SaveCommuteResultInput } from "@/types/commute-result";
import type {
  TransitCommuteFailure,
  TransitCommuteResponseBody,
} from "@/types/transit-commute-route";

type ForbiddenTransitRouteResponseKeys =
  | "coordinate"
  | "coordinates"
  | "origin"
  | "destination"
  | "raw"
  | "rawResponse"
  | "requestUrl"
  | "url"
  | "polyline"
  | "steps"
  | "apiKey"
  | "key";

type ExtractForbiddenKeys<T> = Extract<keyof T, ForbiddenTransitRouteResponseKeys>;

type AssertNoForbiddenKeys<T> =
  ExtractForbiddenKeys<T> extends never ? true : never;

const routeResultDoesNotExposeForbiddenKeys: AssertNoForbiddenKeys<SaveCommuteResultInput> = true;

const routeFailureDoesNotExposeForbiddenKeys: AssertNoForbiddenKeys<TransitCommuteFailure> = true;

const routeResponseDoesNotExposeForbiddenTopLevelKeys: AssertNoForbiddenKeys<TransitCommuteResponseBody> = true;

void routeResultDoesNotExposeForbiddenKeys;
void routeFailureDoesNotExposeForbiddenKeys;
void routeResponseDoesNotExposeForbiddenTopLevelKeys;