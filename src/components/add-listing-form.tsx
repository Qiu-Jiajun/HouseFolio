"use client";

import { FormEvent, useState } from "react";
import type { Listing, ListingSourcePlatform } from "@/types/listing";
import { saveLocalListing } from "@/lib/local-store/listings";

const sourcePlatformOptions: {
  label: string;
  value: ListingSourcePlatform;
}[] = [
  { label: "手动添加", value: "manual" },
  { label: "贝壳", value: "beike" },
  { label: "58 同城", value: "58" },
  { label: "豆瓣", value: "douban" },
  { label: "小红书", value: "xiaohongshu" },
  { label: "其他", value: "other" },
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
      setError("请填写房源标题。");
      return;
    }

    if (!rent.trim() || Number(rent) <= 0) {
      setError("请填写有效租金。");
      return;
    }

    if (!area.trim() || Number(area) <= 0) {
      setError("请填写有效面积。");
      return;
    }

    if (!layout.trim()) {
      setError("请填写户型。");
      return;
    }

    if (!district.trim()) {
      setError("请填写所在区域。");
      return;
    }

    if (!addressHint.trim()) {
      setError("请填写位置提示，例如“望京 SOHO 附近”或“五道口地铁站附近”。");
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
        <h2 className="text-2xl font-semibold text-white">添加候选房源</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          当前阶段仅保存到浏览器本地，不上传云端。请不要填写手机号、微信号、具体门牌号、身份证号或合同信息。
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-300">房源标题 *</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：望京 SOHO 附近一居室"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">来源平台</span>
          <select
            value={sourcePlatform}
            onChange={(event) =>
              setSourcePlatform(event.target.value as ListingSourcePlatform)
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          >
            {sourcePlatformOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">月租金 *</span>
          <input
            value={rent}
            onChange={(event) => setRent(event.target.value)}
            type="number"
            min="0"
            placeholder="例如：7200"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">面积 *</span>
          <input
            value={area}
            onChange={(event) => setArea(event.target.value)}
            type="number"
            min="0"
            placeholder="例如：45"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">户型 *</span>
          <input
            value={layout}
            onChange={(event) => setLayout(event.target.value)}
            placeholder="例如：1室1厅"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">所在区域 *</span>
          <input
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            placeholder="例如：朝阳区"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm text-slate-300">位置提示 *</span>
          <input
            value={addressHint}
            onChange={(event) => setAddressHint(event.target.value)}
            placeholder="例如：望京 SOHO 附近 / 五道口地铁站附近 / 中关村商圈"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm text-slate-300">原始链接，可选</span>
          <input
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder="只保存 URL，不抓取第三方页面内容"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-200"
        >
          保存到 Portfolio
        </button>

        <a
          href="/portfolio"
          className="rounded-full border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          取消
        </a>
      </div>
    </form>
  );
}
