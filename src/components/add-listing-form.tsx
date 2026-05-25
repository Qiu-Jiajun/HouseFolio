"use client";

import { FormEvent, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import { saveLocalListing } from "@/lib/local-store/listings";
import type { Listing, ListingSourcePlatform } from "@/types/listing";

type SourcePlatformOption = {
  label: string;
  value: ListingSourcePlatform;
};

type SourcePlatformSelectItem =
  | SourcePlatformOption
  | {
      groupLabel: string;
      options: SourcePlatformOption[];
    };

const sourcePlatformSelectItems: SourcePlatformSelectItem[] = [
  { label: zhCN.addListingForm.sourcePlatformOptions.manual, value: "manual" },
  {
    groupLabel: zhCN.addListingForm.sourcePlatformOptionGroups.commonPlatforms,
    options: [
      { label: zhCN.addListingForm.sourcePlatformOptions.beike, value: "beike" },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.lianjia,
        value: "lianjia",
      },
      { label: zhCN.addListingForm.sourcePlatformOptions["58"], value: "58" },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.anjuke,
        value: "anjuke",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.woaiwojia,
        value: "woaiwojia",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.fangtianxia,
        value: "fangtianxia",
      },
    ],
  },
  {
    groupLabel:
      zhCN.addListingForm.sourcePlatformOptionGroups.longTermApartments,
    options: [
      {
        label: zhCN.addListingForm.sourcePlatformOptions.ziroom,
        value: "ziroom",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.xiangyu,
        value: "xiangyu",
      },
      { label: zhCN.addListingForm.sourcePlatformOptions.boyu, value: "boyu" },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.guanyu,
        value: "guanyu",
      },
      { label: zhCN.addListingForm.sourcePlatformOptions.mofang, value: "mofang" },
      { label: zhCN.addListingForm.sourcePlatformOptions.baletu, value: "baletu" },
    ],
  },
  {
    groupLabel: zhCN.addListingForm.sourcePlatformOptionGroups.communitySublets,
    options: [
      {
        label: zhCN.addListingForm.sourcePlatformOptions.xiaohongshu,
        value: "xiaohongshu",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.douban,
        value: "douban",
      },
      { label: zhCN.addListingForm.sourcePlatformOptions.xianyu, value: "xianyu" },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.wechat_moments,
        value: "wechat_moments",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.qq_group,
        value: "qq_group",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.alumni_forum,
        value: "alumni_forum",
      },
    ],
  },
  {
    groupLabel: zhCN.addListingForm.sourcePlatformOptionGroups.offlineReferrals,
    options: [
      {
        label: zhCN.addListingForm.sourcePlatformOptions.local_agency_store,
        value: "local_agency_store",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.landlord_direct,
        value: "landlord_direct",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.referral,
        value: "referral",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.community_notice,
        value: "community_notice",
      },
    ],
  },
  {
    groupLabel:
      zhCN.addListingForm.sourcePlatformOptionGroups.policyInstitutions,
    options: [
      {
        label: zhCN.addListingForm.sourcePlatformOptions.public_rental_platform,
        value: "public_rental_platform",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.talent_apartment_platform,
        value: "talent_apartment_platform",
      },
      {
        label: zhCN.addListingForm.sourcePlatformOptions.employer_school_housing,
        value: "employer_school_housing",
      },
    ],
  },
  { label: zhCN.addListingForm.sourcePlatformOptions.other, value: "other" },
];

export function AddListingForm() {
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [area, setArea] = useState("");
  const [layout, setLayout] = useState("");
  const [district, setDistrict] = useState("");
  const [addressHint, setAddressHint] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourcePlatform, setSourcePlatform] =
    useState<ListingSourcePlatform>("manual");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError(zhCN.addListingForm.errors.titleRequired);
      return;
    }

    if (!rent.trim() || Number(rent) <= 0) {
      setError(zhCN.addListingForm.errors.validRentRequired);
      return;
    }

    if (!area.trim() || Number(area) <= 0) {
      setError(zhCN.addListingForm.errors.validAreaRequired);
      return;
    }

    if (!layout.trim()) {
      setError(zhCN.addListingForm.errors.layoutRequired);
      return;
    }

    if (!district.trim()) {
      setError(zhCN.addListingForm.errors.districtRequired);
      return;
    }

    if (!addressHint.trim()) {
      setError(zhCN.addListingForm.errors.addressHintRequired);
      return;
    }

    const listing: Listing = {
      id: `listing-${Date.now()}`,
      title: title.trim(),
      sourcePlatform,
      sourceUrl: sourceUrl.trim() || undefined,
      rent: Number(rent),
      area: Number(area),
      layout: layout.trim(),
      district: district.trim(),
      addressHint: addressHint.trim(),
      status: "draft",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    saveLocalListing(listing);

    window.location.href = "/portfolio";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {zhCN.addListingForm.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {zhCN.addListingForm.description}
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-300">
            {zhCN.addListingForm.fields.title.label}
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={zhCN.addListingForm.fields.title.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">
            {zhCN.addListingForm.fields.sourcePlatform.label}
          </span>
          <select
            value={sourcePlatform}
            onChange={(event) =>
              setSourcePlatform(event.target.value as ListingSourcePlatform)
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          >
            {sourcePlatformSelectItems.map((item) =>
              "options" in item ? (
                <optgroup key={item.groupLabel} label={item.groupLabel}>
                  {item.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">
            {zhCN.addListingForm.fields.rent.label}
          </span>
          <input
            value={rent}
            onChange={(event) => setRent(event.target.value)}
            type="number"
            min="0"
            placeholder={zhCN.addListingForm.fields.rent.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">
            {zhCN.addListingForm.fields.area.label}
          </span>
          <input
            value={area}
            onChange={(event) => setArea(event.target.value)}
            type="number"
            min="0"
            placeholder={zhCN.addListingForm.fields.area.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">
            {zhCN.addListingForm.fields.layout.label}
          </span>
          <input
            value={layout}
            onChange={(event) => setLayout(event.target.value)}
            placeholder={zhCN.addListingForm.fields.layout.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">
            {zhCN.addListingForm.fields.district.label}
          </span>
          <input
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            placeholder={zhCN.addListingForm.fields.district.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm text-slate-300">
            {zhCN.addListingForm.fields.addressHint.label}
          </span>
          <input
            value={addressHint}
            onChange={(event) => setAddressHint(event.target.value)}
            placeholder={zhCN.addListingForm.fields.addressHint.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm text-slate-300">
            {zhCN.addListingForm.fields.sourceUrl.label}
          </span>
          <input
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder={zhCN.addListingForm.fields.sourceUrl.placeholder}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          {zhCN.addListingForm.actions.save}
        </button>

        <a
          href="/portfolio"
          className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          {zhCN.addListingForm.actions.cancel}
        </a>
      </div>
    </form>
  );
}
