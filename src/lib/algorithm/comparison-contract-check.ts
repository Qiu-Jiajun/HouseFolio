import type {
  BuildComparisonInputOptions,
  ComparisonInput,
} from "@/lib/algorithm/comparison";
import {
  buildComparisonInput,
  buildComparisonInputs,
} from "@/lib/algorithm/comparison";

const mockOptions: BuildComparisonInputOptions = {
  listing: {
    id: "listing-test",
    title: "测试房源",
    rent: 6500,
    area: 48,
    layout: "一室一厅",
    district: "海淀",
    addressHint: "五道口地铁站附近",
    sourcePlatform: "manual",
    status: "watching",
    createdAt: "2026-05-04",
    commuteMinutes: 25,
    commuteSource: "cachedTransit",
    lifeCircleScore: 7.8,
    compositeScore: 8.2,
  },
  commuteResults: [
    {
      id: "commute-test",
      listingId: "listing-test",
      anchorId: "anchor-test",
      anchorName: "学校",
      mode: "transit",
      provider: "mock",
      isMock: true,
      durationMinutes: 25,
      distanceMeters: 6200,
      summary: "公共交通约 25 分钟",
      calculatedAt: "2026-05-04T00:00:00.000Z",
    },
  ],
  subjectiveRatings: {
    listingId: "listing-test",
    light: 4,
    quiet: 3,
    decoration: 5,
    updatedAt: "2026-05-04T00:00:00.000Z",
  },
};

const singleInput: ComparisonInput = buildComparisonInput(mockOptions);
const multipleInputs: ComparisonInput[] = buildComparisonInputs([mockOptions]);

void singleInput;
void multipleInputs;