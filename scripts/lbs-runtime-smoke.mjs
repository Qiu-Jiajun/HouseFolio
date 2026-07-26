import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import net from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const nextCli = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const PORT_RESERVATION_TIMEOUT_MS = 5_000;
const STARTUP_TIMEOUT_MS = 30_000;
const REQUEST_TIMEOUT_MS = 8_000;
const SHUTDOWN_GRACE_MS = 5_000;
const TOTAL_TIMEOUT_MS = 90_000;

async function getAvailablePort() {
  const server = net.createServer();

  try {
    server.unref();

    await Promise.race([
      new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
      }),
      delay(PORT_RESERVATION_TIMEOUT_MS).then(() => {
        throw new Error("Timed out reserving a local QA port.");
      }),
    ]);

    const address = server.address();
    assert(
      address && typeof address === "object",
      "expected an available local port",
    );

    return address.port;
  } finally {
    if (server.listening) {
      server.close();
      await once(server, "close");
    }
  }
}

function createRequestSignal(totalSignal) {
  return AbortSignal.any([
    totalSignal,
    AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  ]);
}

async function waitForServer(
  origin,
  serverProcess,
  getServerOutput,
  totalSignal,
) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;

  while (Date.now() < deadline) {
    totalSignal.throwIfAborted();

    if (serverProcess.exitCode !== null) {
      throw new Error(
        `Next.js exited before smoke checks started.\n${getServerOutput()}`,
      );
    }

    try {
      const response = await fetch(`${origin}/portfolio/new`, {
        signal: createRequestSignal(totalSignal),
      });

      if (response.ok) {
        return;
      }
    } catch {
      // The production server may still be binding its port.
    }

    await delay(100, undefined, { signal: totalSignal });
  }

  throw new Error(
    `Timed out waiting for the Next.js production server.\n${getServerOutput()}`,
  );
}

async function postJson(origin, pathname, body, totalSignal) {
  const response = await fetch(`${origin}${pathname}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: createRequestSignal(totalSignal),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

function createCommutePayload(mode) {
  return {
    listing: {
      id: "listing-smoke",
      title: "Smoke test listing",
      addressHint: "望京 SOHO",
      district: "朝阳区",
    },
    workLocations: [
      {
        id: "anchor-smoke",
        name: "Smoke test anchor",
        addressHint: "中关村",
      },
    ],
    city: "北京",
    ...(mode === undefined ? {} : { mode }),
  };
}

function assertNoSensitiveLbsFields(value) {
  const serialized = JSON.stringify(value);

  for (const forbiddenText of [
    "AMAP_API_KEY",
    "restapi.amap.com",
    "coordinate",
    "latitude",
    "longitude",
  ]) {
    assert(
      !serialized.includes(forbiddenText),
      `response exposed forbidden LBS text: ${forbiddenText}`,
    );
  }
}

async function waitForExit(serverProcess, timeoutMs) {
  if (serverProcess.exitCode !== null) {
    return true;
  }

  return Promise.race([
    once(serverProcess, "exit").then(() => true),
    delay(timeoutMs).then(() => false),
  ]);
}

async function stopServer(serverProcess) {
  if (serverProcess.exitCode !== null) {
    return;
  }

  const ownedPid = serverProcess.pid;
  assert(Number.isInteger(ownedPid), "expected an owned Next.js child PID");

  serverProcess.kill();

  if (await waitForExit(serverProcess, SHUTDOWN_GRACE_MS)) {
    return;
  }

  if (process.platform === "win32") {
    spawnSync(
      "taskkill.exe",
      ["/PID", String(ownedPid), "/T", "/F"],
      {
        stdio: "ignore",
        windowsHide: true,
      },
    );
  } else {
    serverProcess.kill("SIGKILL");
  }

  assert(
    await waitForExit(serverProcess, SHUTDOWN_GRACE_MS),
    `owned Next.js process ${ownedPid} did not exit`,
  );
}

async function assertPortClosed(port) {
  const socket = net.createConnection({
    host: "127.0.0.1",
    port,
  });
  socket.unref();

  try {
    const connected = await new Promise((resolve) => {
      const finish = (result) => {
        socket.removeAllListeners("connect");
        socket.removeAllListeners("error");
        socket.removeAllListeners("timeout");
        resolve(result);
      };

      socket.once("connect", () => finish(true));
      socket.once("error", () => finish(false));
      socket.once("timeout", () => finish(false));
      socket.setTimeout(1_000);
    });

    assert(!connected, `owned QA port ${port} is still accepting connections`);
  } finally {
    socket.destroy();
  }
}

async function run(totalSignal) {
  const port = await getAvailablePort();
  const origin = `http://127.0.0.1:${port}`;
  let serverOutput = "";

  const serverProcess = spawn(
    process.execPath,
    [nextCli, "start", "-H", "127.0.0.1", "-p", String(port)],
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        LBS_PROVIDER: "mock",
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );

  const captureOutput = (chunk) => {
    serverOutput = `${serverOutput}${chunk.toString()}`.slice(-12_000);
  };

  serverProcess.stdout.on("data", captureOutput);
  serverProcess.stderr.on("data", captureOutput);

  try {
    assert(
      Number.isInteger(serverProcess.pid),
      "expected an owned Next.js child PID",
    );

    await waitForServer(
      origin,
      serverProcess,
      () => serverOutput,
      totalSignal,
    );

    const tips = await postJson(origin, "/api/lbs/poi/tips", {
      keywords: "望京",
      city: "010",
    }, totalSignal);
    assert.equal(tips.status, 200);
    assert.equal(tips.body.provider, "mock");
    assert.equal(tips.body.isMock, true);
    assert.equal(tips.body.suggestions.length, 1);
    assert.equal(tips.body.suggestions[0].district, "");
    assertNoSensitiveLbsFields(tips.body);

    const invalidCity = await postJson(origin, "/api/lbs/poi/tips", {
      keywords: "望京",
      city: "北京",
    }, totalSignal);
    assert.equal(invalidCity.status, 400);

    const oversizedTips = await postJson(origin, "/api/lbs/poi/tips", {
      keywords: "望京",
      city: "010",
      padding: "x".repeat(2_000),
    }, totalSignal);
    assert.equal(oversizedTips.status, 413);

    const testedModes = [];

    for (const mode of [undefined, "transit", "walking", "cycling", "driving"]) {
      const commute = await postJson(
        origin,
        "/api/lbs/commute/transit",
        createCommutePayload(mode),
        totalSignal,
      );
      const expectedMode = mode ?? "transit";

      assert.equal(commute.status, 200);
      assert.equal(commute.body.results.length, 1);
      assert.equal(commute.body.results[0].mode, expectedMode);
      assert.equal(commute.body.resolvedLocations.length, 2);
      assertNoSensitiveLbsFields(commute.body);
      testedModes.push(expectedMode);
    }

    const invalidMode = await postJson(
      origin,
      "/api/lbs/commute/transit",
      createCommutePayload("flying"),
      totalSignal,
    );
    assert.equal(invalidMode.status, 400);

    const tooManyAnchorsPayload = createCommutePayload("transit");
    tooManyAnchorsPayload.workLocations = Array.from(
      { length: 4 },
      (_, index) => ({
        id: `anchor-${index}`,
        name: `Anchor ${index}`,
        addressHint: `Address ${index}`,
      }),
    );
    const tooManyAnchors = await postJson(
      origin,
      "/api/lbs/commute/transit",
      tooManyAnchorsPayload,
      totalSignal,
    );
    assert.equal(tooManyAnchors.status, 400);

    const oversizedCommute = await postJson(
      origin,
      "/api/lbs/commute/transit",
      {
        ...createCommutePayload("transit"),
        padding: "x".repeat(20_000),
      },
      totalSignal,
    );
    assert.equal(oversizedCommute.status, 413);

    console.log(
      JSON.stringify({
        status: "passed",
        ownedServerPid: serverProcess.pid,
        ownedServerPort: port,
        tipsCount: tips.body.suggestions.length,
        testedModes,
        resolvedLocations: 2,
        invalidCityStatus: invalidCity.status,
        invalidModeStatus: invalidMode.status,
        tooManyAnchorsStatus: tooManyAnchors.status,
        oversizedBodyStatuses: [
          oversizedTips.status,
          oversizedCommute.status,
        ],
      }),
    );
  } finally {
    await stopServer(serverProcess);
    await assertPortClosed(port);
  }
}

const totalController = new AbortController();
const totalTimeout = setTimeout(() => {
  totalController.abort(
    new Error(`LBS runtime smoke exceeded ${TOTAL_TIMEOUT_MS}ms.`),
  );
}, TOTAL_TIMEOUT_MS);

try {
  await run(totalController.signal);
} finally {
  clearTimeout(totalTimeout);
}
