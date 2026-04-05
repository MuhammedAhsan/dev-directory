/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

function isPidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readDevLock() {
  const lockPath = path.join(process.cwd(), ".next", "dev", "lock");

  if (!fs.existsSync(lockPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(lockPath, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed?.pid !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

const lock = readDevLock();

if (lock && isPidAlive(lock.pid)) {
  const portText = typeof lock.port === "number" ? `:${lock.port}` : "";
  console.log(`A Next.js dev server is already running for this project (PID ${lock.pid}${portText}).`);
  console.log("Stop it normally with Ctrl+C in the terminal where npm run dev is running.");
  process.exit(0);
}

const nextBin = require.resolve("next/dist/bin/next");
const child = spawn(process.execPath, [nextBin, "dev"], {
  stdio: "inherit",
  cwd: process.cwd(),
  env: process.env,
});

function forwardSignal(signal) {
  if (!child.killed) {
    child.kill(signal);
  }
}

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
