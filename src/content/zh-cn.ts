export const zhCN = {
  "common": {
    "pending": "待补充",
    "yes": "是",
    "no": "否",
    "currencyCny": "￥",
    "month": "月",
    "sqm": "㎡",
    "minute": "分钟",
    "listingStatus": {
      "draft": "草稿",
      "watching": "关注中",
      "visited": "已看房",
      "shortlisted": "候选",
      "rejected": "已排除"
    },
    "sourcePlatform": {
      "58": "58 同城",
      "manual": "手动添加",
      "beike": "贝壳",
      "douban": "豆瓣",
      "xiaohongshu": "小红书",
      "other": "其他"
    }
  },
  "nav": {
    "brand": "HouseFolio",
    "home": "首页",
    "portfolio": "候选房源",
    "addListing": "添加房源",
    "settings": "设置"
  },
  "complianceFooter": {
    "title": "HouseFolio 作品集预览版边界说明",
    "body": "HouseFolio 是一个私人找房决策管理工具。它不抓取第三方房源页面，不发布公共房源库，不撮合租赁交易，也不认证房源真实性。当前作品集预览版 仅使用模拟数据与浏览器 localStorage。"
  },
  "home": {
    "eyebrow": "HouseFolio · 私人找房决策工作台",
    "titleLine1": "用 LBS、算法与 AI",
    "titleLine2": "让租房决策更清晰。",
    "description": "HouseFolio 不是房源平台，也不是中介服务。它帮助用户管理自己主动收集的候选房源，并通过三层决策引擎支持空间分析、结构化比较与 AI 辅助解释。",
    "actions": {
      "openPortfolio": "打开候选房源",
      "addListing": "添加房源",
      "settings": "设置"
    },
    "engines": [
      {
        "level": "L1",
        "title": "LBS 空间层",
        "description": "处理通勤、生活圈与地图上下文，把房源位置转化为可比较的空间决策信息。"
      },
      {
        "level": "L2",
        "title": "算法比较层",
        "description": "处理参考评分、排序与对比，把多套候选房源转化为结构化的辅助判断依据。"
      },
      {
        "level": "L3",
        "title": "AI 解释层",
        "description": "处理总结、建议与解释，把结构化数据转化为更容易理解的人话化决策辅助。"
      }
    ],
    "currentPhase": {
      "title": "当前阶段",
      "body": "作品集预览版：工作/学习地点（通勤锚点）设置。当前 Demo 仍只使用模拟数据与浏览器 localStorage，尚未接入 Supabase、地图 API 或 AI 服务。"
    }
  },
  "portfolio": {
    "eyebrow": "HouseFolio · 候选房源",
    "title": "候选房源",
    "description": "这里展示用户主动添加的候选房源，以及用于演示的模拟房源。当前作品集预览版 仅使用浏览器 localStorage 与 mock 数据。参考评分只是辅助比较信号，不代表最终推荐。",
    "actions": {
      "addListing": "添加房源"
    }
  },
  "portfolioList": {
    "stats": {
      "totalListings": "房源总数",
      "currentlyVisible": "当前显示",
      "averageVisibleRent": "当前平均租金"
    },
    "controls": {
      "title": "筛选与排序",
      "description": "这是当前 L2 算法层的入口。排序基于简单规则与参考评分。参考评分只是辅助比较信号，不是最终推荐，也不是产品承诺。",
      "shortlisted": "候选",
      "filterByStatus": "按状态筛选",
      "sortBy": "排序方式",
      "showingAll": "正在显示全部房源。",
      "showingStatusPrefix": "正在显示状态为",
      "showingStatusSuffix": "的房源。"
    },
    "statusOptions": {
      "all": "全部",
      "draft": "草稿",
      "watching": "关注中",
      "visited": "已看房",
      "shortlisted": "候选",
      "rejected": "已排除"
    },
    "sortOptions": {
      "createdAtDesc": "最近添加优先",
      "rentAsc": "租金从低到高",
      "rentDesc": "租金从高到低",
      "commuteAsc": "通勤时间最短",
      "scoreDesc": "参考评分从高到低"
    },
    "empty": {
      "title": "没有匹配的房源",
      "description": "可以尝试切换筛选条件，或在详情页更新房源状态。"
    }
  },
  "listingCard": {
    "fields": {
      "rent": "租金",
      "area": "面积",
      "layout": "户型",
      "commute": "L1 通勤",
      "lifeCircle": "L1 生活圈",
      "referenceScore": "L2 参考评分"
    },
    "referenceScoreNote": "参考评分仅用于辅助比较，不代表最终推荐，也不替用户做决定。",
    "commuteSource": {
      "listing": "默认参考值",
      "cachedTransit": "本地通勤结果"
    },
    "actions": {
      "viewDetails": "查看详情"
    }
  },
  "addListingPage": {
    "actions": {
      "backToPortfolio": "返回候选房源"
    },
    "eyebrow": "HouseFolio · 添加候选房源",
    "title": "新增一套候选房源",
    "description": "这是 HouseFolio 的基础输入层。用户主动添加候选房源后，后续才能进入 L1 通勤与生活圈分析、L2 评分排序、L3 AI 决策建议。"
  },
  "addListingForm": {
    "title": "添加候选房源",
    "description": "当前阶段仅保存到浏览器本地，不上传云端。请不要填写手机号、微信号、具体门牌号、身份证号或合同信息。",
    "errors": {
      "titleRequired": "请填写房源标题。",
      "validRentRequired": "请填写有效租金。",
      "validAreaRequired": "请填写有效面积。",
      "layoutRequired": "请填写户型。",
      "districtRequired": "请填写所在区域。",
      "addressHintRequired": "请填写位置提示，例如“望京 SOHO 附近”或“五道口地铁站附近”。"
    },
    "sourcePlatformOptions": {
      "58": "58 同城",
      "manual": "手动添加",
      "beike": "贝壳",
      "douban": "豆瓣",
      "xiaohongshu": "小红书",
      "other": "其他"
    },
    "fields": {
      "title": {
        "label": "房源标题 *",
        "placeholder": "例如：望京 SOHO 附近一居室"
      },
      "sourcePlatform": {
        "label": "来源平台"
      },
      "rent": {
        "label": "月租金 *",
        "placeholder": "例如：7200"
      },
      "area": {
        "label": "面积 *",
        "placeholder": "例如：45"
      },
      "layout": {
        "label": "户型 *",
        "placeholder": "例如：1室1厅"
      },
      "district": {
        "label": "所在区域 *",
        "placeholder": "例如：朝阳区"
      },
      "addressHint": {
        "label": "位置提示 *",
        "placeholder": "例如：望京 SOHO 附近 / 五道口地铁站附近 / 中关村商圈"
      },
      "sourceUrl": {
        "label": "原始链接，可选",
        "placeholder": "只保存 URL，不抓取第三方页面内容"
      }
    },
    "actions": {
      "save": "保存到候选房源",
      "cancel": "取消"
    }
  },
  "listingDetail": {
    "actions": {
      "backToPortfolio": "返回候选房源"
    }
  },
  "listingDetailView": {
    "loading": "正在加载房源信息……",
    "notFound": {
      "title": "未找到该房源",
      "description": "该房源可能不存在，或浏览器本地数据已经被清除。",
      "action": "返回候选房源"
    },
    "summaryCards": {
      "monthlyRent": "月租金",
      "area": "面积",
      "layout": "户型",
      "originalLink": "查看原始链接"
    },
    "l1": {
      "title": "L1 LBS 空间分析",
      "description": "后续这里会展示通勤时间、生活圈评分、地图位置和周边 POI 统计。当前数值仍是占位或 mock 输出。",
      "commuteTime": "通勤时间",
      "commuteSource": {
        "listing": "默认参考值",
        "cachedTransit": "本地通勤结果"
      },
      "lifeCircleScore": "生活圈评分",
      "mapStatus": "地图状态",
      "notConnected": "未接入",
      "cachedCommuteResults": "已保存的参考通勤结果",
      "emptyCommuteResults": "尚未计算参考通勤",
      "emptyCommuteDescription": "后续可通过手动按钮计算公共交通等参考通勤。当前阶段仅展示本地已保存的通勤摘要。",
      "storedAt": "计算时间",
      "resultAnchor": "通勤锚点",
      "resultMode": "方式",
      "resultDuration": "时长",
      "resultDistance": "距离",
      "modeTransit": "公共交通",
      "modeWalking": "步行",
      "modeCycling": "骑行",
      "modeDriving": "驾车",
      "meter": "米",
      "kilometer": "公里",
      "calculateTransitButton": "计算公共交通参考通勤",
      "calculating": "正在计算参考通勤……",
      "calculateSucceeded": "参考通勤结果已保存到本地。",
      "calculatePartiallySucceeded": "部分参考通勤结果已保存到本地，少数锚点可能暂时无法计算。",
      "calculateFailed": "参考通勤计算失败，请稍后重试。你也可以检查房源地址线索或通勤锚点是否足够清楚。",
      "noWorkLocations": "请先到 Settings 添加工作/学习地点（通勤锚点）。",
      "noWorkLocationsDescription": "当前还没有可用于计算的工作/学习地点。请先到 Settings 添加至少一个通勤锚点，例如公司、学校或伴侣公司附近。",
      "missingListingAddress": "当前房源缺少可用于计算的地址线索。",
      "missingListingAddressDescription": "当前房源没有可用于地理编码的地址线索，因此暂时不能计算通勤。请先补充小区、地铁站、商圈或街道级地址。",
      "anchorCountPrefix": "当前本地通勤锚点：",
      "anchorCountSuffix": " 个",
      "referenceOnly": "通勤结果基于高德路径规划计算，仅作辅助比较；实际通勤受等车、换乘、拥堵、天气等因素影响。"
    },
    "l2": {
      "title": "L2 参考评分",
      "description": "该分数是基于租金、面积、通勤、生活圈评分和主观评分生成的轻量辅助比较信号，不是最终推荐。用户仍然可以基于任何硬性条件一票否决。",
      "referenceScore": "参考评分",
      "defaultWeight": "默认权重",
      "rows": {
        "rent": "租金贡献",
        "area": "面积贡献",
        "commute": "通勤贡献",
        "lifeCircle": "生活圈贡献",
        "subjective": "主观评分贡献"
      },
      "disclaimer": "该参考评分不是最终推荐。用户仍然可能因为通勤无法接受、采光差、租金过高或其他当前公式没有捕捉到的个人硬性条件，直接排除某套房源。"
    },
    "l3": {
      "title": "L3 AI 决策建议",
      "description": "后续在用户明确确认并完成数据脱敏后，这里会基于基础信息、L1/L2 输出、笔记、评分和状态生成 checklist、风险解释和决策建议。",
      "disabledButton": "AI 分析尚未接入"
    },
    "basicInfo": {
      "title": "基础信息",
      "sourcePlatform": "来源平台",
      "createdAt": "添加日期",
      "currentStatus": "当前状态",
      "dataScope": "数据范围",
      "dataScopeValue": "本地或 mock 数据，未上传云端。"
    },
    "complianceBoundary": {
      "title": "合规边界",
      "body": "当前 Demo 只展示用户主动添加或 mock 的房源信息。它不抓取第三方页面，不发布公共房源库，不撮合交易，也不认证房源真实性。"
    }
  },
  "listingStatusPanel": {
    "title": "房源状态管理",
    "description": "状态用于标记这套房源在你的找房决策流程中的位置。当前阶段仅保存到浏览器本地。",
    "currentStatus": "当前状态",
    "statusDescription": "状态说明",
    "savedMessage": "状态已保存到本地。",
    "options": {
      "draft": {
        "label": "草稿",
        "description": "刚添加，还没有认真评估。"
      },
      "watching": {
        "label": "关注中",
        "description": "值得继续观察，但还没有进入最终候选。"
      },
      "visited": {
        "label": "已看房",
        "description": "已经线下看过，等待复盘。"
      },
      "shortlisted": {
        "label": "候选",
        "description": "进入最终对比池，可以参与后续 L2 对比。"
      },
      "rejected": {
        "label": "已排除",
        "description": "暂不考虑，但保留决策记录。"
      }
    }
  },
  "listingNotesPanel": {
    "title": "看房笔记与主观评分",
    "description": "记录你自己的看房笔记和主观感受。当前数据仅保存在浏览器本地，不会上传云端。请不要填写手机号、微信号、身份证号、具体门牌号或合同原文。",
    "savedMessages": {
      "noteSaved": "笔记已保存到本地。",
      "ratingsSaved": "主观评分已保存到本地。"
    },
    "ratings": {
      "light": "采光",
      "quiet": "安静程度",
      "decoration": "装修",
      "options": [
        "1 - 很差",
        "2 - 较弱",
        "3 - 一般",
        "4 - 较好",
        "5 - 很好"
      ],
      "averageLabel": "当前主观平均分：",
      "saveButton": "保存主观评分"
    },
    "note": {
      "label": "看房笔记",
      "placeholder": "例如：采光不错，但有一点吵；厨房偏小；房东要求押一付三。不要填写敏感信息。",
      "saveButton": "保存笔记"
    },
    "savedNotes": {
      "title": "已保存笔记",
      "empty": "还没有笔记。"
    }
  },
  "workLocationSettingsPanel": {
    "title": "工作/学习地点（通勤锚点）",
    "description": "工作/学习地点是后续 L1 LBS 通勤分析的输入。它可以是本人公司、伴侣公司、学校、孩子学校或其他高频目的地。当前阶段仅保存到浏览器本地，不接高德、不地理编码、不计算通勤。",
    "form": {
      "name": {
        "label": "地点名称 *",
        "placeholder": "例如：我的公司 / 伴侣公司 / 学校 / 孩子学校"
      },
      "addressHint": {
        "label": "位置提示 *",
        "placeholder": "例如：望京 SOHO 附近 / 五道口地铁站附近 / 某某学校附近"
      },
      "note": {
        "label": "备注，可选",
        "placeholder": "例如：我的工作日通勤 / 伴侣通勤 / 孩子上学参考。不要填写精确门牌号。"
      },
      "save": "保存通勤锚点"
    },
    "errors": {
      "nameRequired": "请填写地点名称。",
      "addressHintRequired": "请填写位置提示。"
    },
    "savedMessage": "工作/学习地点已保存到本地。",
    "empty": "还没有工作/学习地点。建议添加 1–3 个通勤锚点，例如本人公司、伴侣公司、学校或孩子学校。后续 L1 LBS 会基于这些锚点进行空间折中分析。",
    "cards": {
      "addressHint": "位置提示",
      "note": "备注",
      "createdAt": "添加时间",
      "delete": "删除"
    },
    "deleteConfirm": "确认删除这个工作/学习地点吗？",
    "boundary": "请优先使用地铁站、商圈、写字楼、学校附近等模糊位置，不要填写精确门牌号。对于多人共同居住场景，建议添加 2–3 个通勤锚点，便于后续比较不同房源对每个人的通勤影响。"
  },
  "settings": {
    "eyebrow": "HouseFolio · 作品集预览版K",
    "title": "设置与本地数据",
    "description": "导出或清除当前浏览器中保存的 HouseFolio 本地数据。这个页面是 Demo 阶段隐私与数据权利能力的基础。"
  },
  "settingsLocalDataPanel": {
    "messages": {
      "exportStarted": "本地 HouseFolio 数据导出已开始。",
      "clearConfirm": "确认清除当前浏览器中的所有 HouseFolio 本地数据吗？代码中的 mock 房源仍会继续显示。",
      "cleared": "当前浏览器中的 HouseFolio 本地数据已清除。",
      "importStarted": "本地 HouseFolio JSON 导入已开始。"
    },
    "controls": {
      "title": "本地数据控制",
      "description": "当前作品集预览版 数据仅保存在这个浏览器中。你可以在这里导出或清除本地 HouseFolio 数据。该操作不会影响写在源代码中的 mock 房源，也不会删除任何云端数据，因为当前尚未接入云端存储。",
      "exportJson": "导出本地 JSON",
      "clearLocalData": "清除本机数据",
      "refreshSnapshot": "刷新数据快照"
    },
    "snapshot": {
      "title": "LocalStorage 数据快照",
      "exists": "是否存在",
      "count": "数量"
    },
    "localDataLabels": {
      "housefolio:listings": "用户添加的候选房源",
      "housefolio:listing-notes": "房源笔记",
      "housefolio:listing-ratings": "主观评分",
      "housefolio:listing-status-overrides": "房源状态覆盖",
      "housefolio:work-locations": "工作/学习地点（通勤锚点）",
      "housefolio:commute-results": "参考通勤结果"
    },
    "complianceBoundary": {
      "title": "合规边界",
      "items": [
        "HouseFolio 不抓取第三方房源页面。",
        "HouseFolio 不发布公共房源库。",
        "HouseFolio 不撮合租赁交易。",
        "当前作品集预览版 数据仅保存在浏览器 localStorage。",
        "当前尚未接入 AI、地图 API、云数据库或云存储。"
      ]
    },
    "importJson": {
      "title": "导入本地 JSON",
      "description": "从你之前导出的 HouseFolio JSON 文件中恢复本机结构化数据。导入会覆盖当前本机保存的房源、笔记、评分、状态、通勤锚点和通勤结果，但不会恢复看房照片。",
      "warning": "导入前建议先导出当前本机数据作为备份。JSON 导入只恢复结构化数据，不包含本机照片文件。",
      "fileLabel": "选择 HouseFolio JSON 文件",
      "noFileSelected": "尚未选择文件。",
      "selectedFilePrefix": "已选择：",
      "action": "导入 HouseFolio JSON",
      "importing": "正在导入…",
      "confirmMessage": "导入这个 JSON 文件会覆盖当前本机保存的 HouseFolio 结构化数据，包括房源、笔记、评分、状态、通勤锚点和通勤结果。此操作不会恢复或导入本机照片。建议你先导出当前数据作为备份。是否继续？",
      "recognizedKeys": "识别到的可导入数据项",
      "ignoredKeys": "将被忽略的未知数据项",
      "importedKeys": "已导入数据项",
      "messages": {
        "success": "导入成功。已更新本机结构化数据。看房照片不包含在 JSON 导入中，如需迁移照片，请等待后续备份包功能。"
      },
      "errors": {
        "noFileSelected": "请选择一个 HouseFolio JSON 文件。",
        "importFailed": "导入失败，请确认文件格式正确，并确认浏览器允许本地存储。"
      }
    }
  },
  "listingPhotoPanel": {
    "eyebrow": "基础层 · 本机照片资料",
    "title": "看房照片｜本机保存",
    "description": "把你实地看房时主动拍摄的照片保存到这套房源档案中。照片文件本体仅保存在当前浏览器与设备中，不会默认上传云端。",
    "localOnlyNotice": "照片仅保存在当前浏览器与设备中，不会默认上传云端。请避免保存身份证、合同、手机号、微信号、具体门牌号、人脸等敏感内容。",
    "photoAltPrefix": "看房照片：",
    "actions": {
      "addPhoto": "添加本地照片",
      "saving": "正在保存…",
      "deletePhoto": "删除",
      "deleting": "正在删除…"
    },
    "empty": {
      "title": "还没有为这套房源保存看房照片",
      "description": "你可以添加 JPG、PNG 或 WebP 图片。当前最小实现只做本机保存、展示和删除，不做云同步、AI 分析或公开分享。"
    },
    "messages": {
      "saved": "照片已保存到本机。",
      "deleted": "照片已从本机删除。"
    },
    "errors": {
      "unsupportedType": "当前仅支持 JPG、PNG 或 WebP 图片。",
      "fileTooLarge": "单张照片不能超过 5MB。",
      "loadFailed": "本机照片读取失败，请稍后重试。",
      "saveFailed": "照片保存失败，请稍后重试。",
      "deleteFailed": "照片删除失败，请稍后重试。"
    }
  },
  "settingsPhotoDataPanel": {
    "eyebrow": "本地优先 · 照片数据",
    "title": "看房照片｜本机保存",
    "description": "这里展示当前浏览器与设备中保存的看房照片数据状态。照片文件本体不保存在 localStorage 中，也不会默认上传云端。",
    "actions": {
      "refresh": "刷新照片状态",
      "clearAll": "清除全部本机照片",
      "clearing": "正在清除…"
    },
    "metrics": {
      "photoCount": "本机照片数量",
      "totalSize": "本机照片占用空间",
      "storageLocation": "存储位置"
    },
    "values": {
      "localIndexedDb": "当前浏览器与设备的本地数据库"
    },
    "notices": {
      "localOnly": "这些照片仅保存在当前浏览器与设备中。",
      "noCloudSync": "当前未开启云端同步，照片不会默认上传云端。",
      "noAi": "当前不会将照片发送给 AI，也不会进行 AI 照片分析。",
      "browserDataWarning": "更换设备、清除网站数据或使用无痕模式，可能导致本机照片不可见。",
      "backupLater": "后续将通过 Portfolio 备份包支持照片导出与导入；当前 JSON 导出暂不包含照片文件本体。",
      "clearScope": "清除全部本机照片只会删除照片文件本体，不会删除房源、笔记、评分、状态、通勤锚点或通勤结果。"
    },
    "messages": {
      "clearConfirm": "确认清除当前浏览器与设备中保存的全部看房照片吗？该操作不会删除房源、笔记、评分或通勤结果，但照片文件本体将从本机删除，且当前阶段无法恢复。",
      "cleared": "本机照片已清除。"
    },
    "states": {
      "loadFailed": "本机照片数据读取失败，请稍后重试。",
      "clearFailed": "本机照片清除失败，请稍后重试。"
    }
  }
} as const;
