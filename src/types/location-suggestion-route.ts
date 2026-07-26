import type {
  LbsProviderName,
  LocationSuggestion,
} from "@/lib/lbs/provider";

export type LocationSuggestionRequestBody = {
  keywords?: string;
  city?: string;
};

export type LocationSuggestionResponseBody = {
  provider?: LbsProviderName;
  isMock?: boolean;
  suggestions: LocationSuggestion[];
  message?: string;
};
