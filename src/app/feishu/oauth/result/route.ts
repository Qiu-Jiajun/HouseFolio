export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const ok = new URL(request.url).searchParams.get("status") === "authorized";
  const title = ok ? "已收到授权完成回执" : "本次授权未完成";
  const text = ok ? "请返回 AWR Test 当前飞书会话，重新发送新建 Base 要求，核对本人身份确认卡后执行。最终授权状态以 AWR Test 为准。"
    : "请返回 AWR Test，发送 /base-authorize 获取新链接后重新授权。若再次失败，请告知验收助手。";
  return new Response(`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>飞书授权</title><body><main><h1>${title}</h1><p>${text}</p><p>可以关闭此页面。</p></main></body></html>`, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "referrer-policy": "no-referrer",
      "content-security-policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'", "x-content-type-options": "nosniff" },
  });
}
