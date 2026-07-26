import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import {
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const TOTAL_TIMEOUT_MS = 120_000;
const CLEANUP_RESERVE_MS = 10_000;
const STARTUP_TIMEOUT_MS = 30_000;
const REQUEST_TIMEOUT_MS = 2_000;
const CHILD_GRACEFUL_EXIT_MS = 3_000;
const CHILD_FORCED_EXIT_MS = 5_000;

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

function getArgument(name) {
  const index = process.argv.indexOf(name);

  if (index === -1 || !process.argv[index + 1]) {
    throw new Error(`Missing required argument: ${name}`);
  }

  return process.argv[index + 1];
}

function getOptionalArgument(name) {
  const index = process.argv.indexOf(name);

  return index === -1 ? undefined : process.argv[index + 1];
}

function validateRunDirectory(runDirectory) {
  const normalizedRunDirectory = path.resolve(runDirectory);
  const normalizedTempDirectory = path.resolve(os.tmpdir());
  const relativePath = path.relative(
    normalizedTempDirectory,
    normalizedRunDirectory,
  );

  assert(
    relativePath &&
      !relativePath.startsWith("..") &&
      !path.isAbsolute(relativePath),
    "browser QA run directory must be a unique child of the system temp directory",
  );
  assert(
    path.basename(normalizedRunDirectory).startsWith(
      "housefolio-lbs-browser-qa-",
    ),
    "browser QA run directory must use the HouseFolio QA prefix",
  );

  return normalizedRunDirectory;
}

async function atomicWriteJson(filePath, value) {
  const temporaryPath = `${filePath}.tmp-${process.pid}`;
  await writeFile(
    temporaryPath,
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );
  await rename(temporaryPath, filePath);
}

async function getAvailablePort() {
  const server = net.createServer();

  try {
    server.unref();

    await Promise.race([
      new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
      }),
      delay(5_000).then(() => {
        throw new Error("Timed out reserving a browser QA port.");
      }),
    ]);

    const address = server.address();
    assert(
      address && typeof address === "object",
      "expected a browser QA port",
    );

    return address.port;
  } finally {
    if (server.listening) {
      server.close();
      await once(server, "close");
    }
  }
}

function isChildRunning(childProcess) {
  return (
    childProcess &&
    childProcess.exitCode === null &&
    childProcess.signalCode === null
  );
}

function createRequestSignal(externalSignal, deadlineAt) {
  const remainingMs = Math.max(1, deadlineAt - Date.now());

  return AbortSignal.any([
    externalSignal,
    AbortSignal.timeout(Math.min(REQUEST_TIMEOUT_MS, remainingMs)),
  ]);
}

async function waitForReady({
  childProcess,
  getSpawnError,
  origin,
  externalSignal,
  qaDeadlineAt,
  getServerOutput,
}) {
  const startupDeadlineAt = Math.min(
    Date.now() + STARTUP_TIMEOUT_MS,
    qaDeadlineAt,
  );

  while (Date.now() < startupDeadlineAt) {
    externalSignal.throwIfAborted();

    if (getSpawnError()) {
      throw getSpawnError();
    }

    if (!isChildRunning(childProcess)) {
      throw new Error(
        `Next.js exited before browser QA readiness.\n${getServerOutput()}`,
      );
    }

    try {
      const response = await fetch(`${origin}/portfolio/new`, {
        signal: createRequestSignal(externalSignal, startupDeadlineAt),
      });

      if (response.ok) {
        return;
      }
    } catch (error) {
      if (externalSignal.aborted) {
        throw error;
      }
    }

    await delay(100, undefined, { signal: externalSignal });
  }

  throw new Error(
    `Timed out waiting for browser QA readiness.\n${getServerOutput()}`,
  );
}

async function waitForQaResult({
  completionPath,
  runId,
  childPid,
  childProcess,
  getSpawnError,
  externalSignal,
  qaDeadlineAt,
  getServerOutput,
}) {
  while (Date.now() < qaDeadlineAt) {
    externalSignal.throwIfAborted();

    if (getSpawnError()) {
      throw getSpawnError();
    }

    if (!isChildRunning(childProcess)) {
      throw new Error(
        `Next.js exited before browser QA completed.\n${getServerOutput()}`,
      );
    }

    try {
      const result = JSON.parse(await readFile(completionPath, "utf8"));

      assert.equal(result.runId, runId, "browser QA result runId mismatch");
      assert.equal(
        result.childPid,
        childPid,
        "browser QA result childPid mismatch",
      );
      assert(
        result.status === "passed" || result.status === "failed",
        "browser QA result must be passed or failed",
      );

      return result;
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }

    await delay(100, undefined, { signal: externalSignal });
  }

  throw new Error("Browser QA completion signal was not received in time.");
}

async function waitForChildExit(childExitPromise, timeoutMs) {
  return Promise.race([
    childExitPromise.then(() => true),
    delay(timeoutMs).then(() => false),
  ]);
}

async function stopOwnedChildTree(childProcess, childExitPromise) {
  if (!childProcess?.pid || !isChildRunning(childProcess)) {
    return "already-exited";
  }

  const ownedChildPid = childProcess.pid;
  childProcess.kill();

  if (
    await waitForChildExit(childExitPromise, CHILD_GRACEFUL_EXIT_MS)
  ) {
    return "graceful-child-kill";
  }

  if (process.platform === "win32") {
    spawnSync(
      "taskkill.exe",
      ["/PID", String(ownedChildPid), "/T", "/F"],
      {
        shell: false,
        stdio: "ignore",
        timeout: CHILD_FORCED_EXIT_MS,
        windowsHide: true,
      },
    );
  } else {
    childProcess.kill("SIGKILL");
  }

  assert(
    await waitForChildExit(childExitPromise, CHILD_FORCED_EXIT_MS),
    `owned browser QA child ${ownedChildPid} did not exit`,
  );

  return process.platform === "win32"
    ? "taskkill-owned-pid-tree"
    : "sigkill-owned-child";
}

async function canBindPort(port) {
  const server = net.createServer();

  try {
    server.unref();

    return await Promise.race([
      new Promise((resolve) => {
        server.once("error", () => resolve(false));
        server.listen(port, "127.0.0.1", () => resolve(true));
      }),
      delay(2_000).then(() => false),
    ]);
  } finally {
    if (server.listening) {
      server.close();
      await once(server, "close");
    }
  }
}

async function run() {
  const runId = getArgument("--run-id");
  const runDirectory = validateRunDirectory(
    getArgument("--run-dir"),
  );
  const startedAt = new Date();
  const hardDeadlineAt = Date.now() + TOTAL_TIMEOUT_MS;
  const qaDeadlineAt = hardDeadlineAt - CLEANUP_RESERVE_MS;
  const manifestPath = path.join(runDirectory, "manifest.json");
  const completionPath = path.join(runDirectory, "qa-result.json");
  const serverLogPath = path.join(runDirectory, "server.log");
  const finalPath = path.join(runDirectory, "final.json");
  const externalAbort = new AbortController();
  let childProcess;
  let childExitPromise;
  let childSpawnError;
  let port;
  let serverOutput = "";
  let qaResult;
  let primaryError;
  let cleanupError;
  let cleanupMethod = "not-started";
  let portReleased = false;

  const hardTimeout = setTimeout(() => {
    externalAbort.abort(
      new Error(`Browser QA owner exceeded ${TOTAL_TIMEOUT_MS}ms.`),
    );
  }, TOTAL_TIMEOUT_MS);

  const abortOnSignal = (signalName) => {
    externalAbort.abort(
      new Error(`Browser QA owner received ${signalName}.`),
    );
  };
  const onSigInt = () => abortOnSignal("SIGINT");
  const onSigTerm = () => abortOnSignal("SIGTERM");

  process.once("SIGINT", onSigInt);
  process.once("SIGTERM", onSigTerm);

  try {
    await mkdir(runDirectory, { recursive: false });
    const requestedPort = getOptionalArgument("--port");

    if (requestedPort === undefined) {
      port = await getAvailablePort();
    } else {
      port = Number(requestedPort);
      assert(
        Number.isInteger(port) && port >= 1_024 && port <= 65_535,
        "requested browser QA port must be an integer from 1024 to 65535",
      );
      assert(
        await canBindPort(port),
        `requested browser QA port ${port} is unavailable`,
      );
    }

    childProcess = spawn(
      process.execPath,
      [nextCli, "start", "-H", "127.0.0.1", "-p", String(port)],
      {
        cwd: projectRoot,
        detached: false,
        env: {
          ...process.env,
          LBS_PROVIDER: "mock",
        },
        shell: false,
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      },
    );

    assert(
      Number.isInteger(childProcess.pid),
      "expected an owned browser QA child PID",
    );

    childProcess.once("error", (error) => {
      childSpawnError = error;
    });
    childExitPromise = new Promise((resolve) => {
      childProcess.once("exit", (exitCode, signalCode) => {
        resolve({ exitCode, signalCode });
      });
    });

    const captureOutput = (chunk) => {
      serverOutput = `${serverOutput}${chunk.toString()}`.slice(
        -32_000,
      );
    };
    childProcess.stdout.on("data", captureOutput);
    childProcess.stderr.on("data", captureOutput);

    const origin = `http://127.0.0.1:${port}`;

    await waitForReady({
      childProcess,
      getSpawnError: () => childSpawnError,
      origin,
      externalSignal: externalAbort.signal,
      qaDeadlineAt,
      getServerOutput: () => serverOutput,
    });

    await atomicWriteJson(manifestPath, {
      schemaVersion: 1,
      runId,
      status: "ready",
      ownerPid: process.pid,
      childPid: childProcess.pid,
      host: "127.0.0.1",
      port,
      origin,
      provider: "mock",
      startedAt: startedAt.toISOString(),
      readyAt: new Date().toISOString(),
      qaDeadlineAt: new Date(qaDeadlineAt).toISOString(),
      hardDeadlineAt: new Date(hardDeadlineAt).toISOString(),
      completionPath,
      serverLogPath,
    });

    console.log(
      JSON.stringify({
        event: "ready",
        runId,
        ownerPid: process.pid,
        childPid: childProcess.pid,
        origin,
        manifestPath,
      }),
    );

    qaResult = await waitForQaResult({
      completionPath,
      runId,
      childPid: childProcess.pid,
      childProcess,
      getSpawnError: () => childSpawnError,
      externalSignal: externalAbort.signal,
      qaDeadlineAt,
      getServerOutput: () => serverOutput,
    });

    if (qaResult.status !== "passed") {
      throw new Error(
        qaResult.message || "Browser QA reported a failed result.",
      );
    }
  } catch (error) {
    primaryError = error;
  } finally {
    clearTimeout(hardTimeout);
    process.removeListener("SIGINT", onSigInt);
    process.removeListener("SIGTERM", onSigTerm);

    try {
      cleanupMethod = await stopOwnedChildTree(
        childProcess,
        childExitPromise,
      );
      portReleased =
        typeof port === "number" ? await canBindPort(port) : true;
      assert(portReleased, `browser QA port ${port} was not released`);
    } catch (error) {
      cleanupError = error;
    }

    if (runDirectory) {
      await writeFile(serverLogPath, serverOutput, "utf8").catch(
        () => undefined,
      );
      await atomicWriteJson(finalPath, {
        schemaVersion: 1,
        runId,
        status:
          primaryError || cleanupError ? "failed" : "passed",
        ownerPid: process.pid,
        childPid: childProcess?.pid ?? null,
        port: port ?? null,
        qaResult: qaResult ?? null,
        childExitCode: childProcess?.exitCode ?? null,
        childSignalCode: childProcess?.signalCode ?? null,
        cleanupMethod,
        portReleased,
        primaryError:
          primaryError instanceof Error
            ? primaryError.message
            : primaryError
              ? String(primaryError)
              : null,
        cleanupError:
          cleanupError instanceof Error
            ? cleanupError.message
            : cleanupError
              ? String(cleanupError)
              : null,
        finishedAt: new Date().toISOString(),
      }).catch(() => undefined);
    }
  }

  if (primaryError && cleanupError) {
    throw new AggregateError(
      [primaryError, cleanupError],
      "Browser QA and owned-process cleanup both failed.",
    );
  }

  if (primaryError) {
    throw primaryError;
  }

  if (cleanupError) {
    throw cleanupError;
  }

  console.log(
    JSON.stringify({
      event: "completed",
      runId,
      status: "passed",
      childPid: childProcess.pid,
      cleanupMethod,
      portReleased,
      finalPath,
    }),
  );
}

await run();
