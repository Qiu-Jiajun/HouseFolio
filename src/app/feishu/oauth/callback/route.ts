export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  let authorized = false;
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const allowed = new Set(["state", "code", "error", "error_description"]);
  const valid = [...url.searchParams.keys()].every(key => allowed.has(key) && url.searchParams.getAll(key).length === 1)
    && state && /^[A-Za-z0-9_-]{43}$/.test(state)
    && (code ? code.length <= 4096 && !error : error === "access_denied");
  if (valid) {
    try {
      const response = await fetch("https://192.236.151.254/api/awr-test/feishu/oauth/callback", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify(code ? { state, code } : { state, error: "access_denied" }),
        cache: "no-store", redirect: "error", signal: AbortSignal.timeout(45000),
      });
      const result = await response.json();
      authorized = response.ok && Object.keys(result).length === 1 && result.authorized === true;
    } catch { /* No request URLs, codes, or upstream errors enter application logs. */ }
  }
  // Leave the code-bearing URL immediately. No client JS or third-party assets.
  return new Response(null, { status: 303, headers: {
    location: `/feishu/oauth/result?status=${authorized ? "authorized" : "failed"}`,
    "cache-control": "no-store", "referrer-policy": "no-referrer",
  } });
}

// Next otherwise invokes GET for HEAD, which could consume an authorization code.
export function HEAD() { return new Response(null, { status: 405, headers: { "cache-control": "no-store" } }); }
