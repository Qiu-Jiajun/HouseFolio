import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

async function route(name) {
  const source = await readFile(new URL(`../src/app/feishu/oauth/${name}/route.ts`, import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
}
const callback = await route("callback"), result = await route("result");
const originalFetch = globalThis.fetch;
let calls = 0, reply = { authorized: true };
globalThis.fetch = async (url, options) => {
  calls++;
  assert.equal(url, "https://192.236.151.254/api/awr-test/feishu/oauth/callback");
  assert.equal(options.method, "POST");
  assert.equal(options.redirect, "error");
  assert.equal(options.cache, "no-store");
  assert.deepEqual(Object.keys(options.headers), ["content-type"]);
  assert.equal(JSON.parse(options.body).code, "synthetic-code");
  return Response.json(reply);
};
try {
  const prefix = "https://house-folio.vercel.app/feishu/oauth/callback";
  for (const query of ["", "?state=bad&code=x", `?state=${"s".repeat(43)}&code=x&code=y`]) {
    assert.equal((await callback.GET(new Request(prefix + query))).headers.get("location"), "/feishu/oauth/result?status=failed");
  }
  assert.equal(calls, 0);
  assert.equal(callback.HEAD().status, 405);
  const req = new Request(`${prefix}?state=${"s".repeat(43)}&code=synthetic-code`, { headers: { cookie: "private", authorization: "private" } });
  const response = await callback.GET(req);
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/feishu/oauth/result?status=authorized");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.equal(calls, 1);
  reply = { authorized: true, access_token: "PRIVATE" };
  assert.equal((await callback.GET(req)).headers.get("location"), "/feishu/oauth/result?status=failed");
  const html = result.GET(new Request("https://house-folio.vercel.app/feishu/oauth/result?status=authorized&code=PRIVATE"));
  assert.equal(html.headers.get("cache-control"), "no-store");
  assert.doesNotMatch(await html.text(), /<script|PRIVATE|synthetic-code|<img/);
} finally { globalThis.fetch = originalFetch; }
console.log("HOUSEFOLIO_FEISHU_OAUTH_CONTRACT_OK");
