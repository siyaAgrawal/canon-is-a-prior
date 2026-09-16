"use client";

import { useEffect, useState } from "react";
import type { Scenario } from "@/types";

interface Config {
  configured: boolean;
  tokenConfigured: boolean;
  model: string;
  promptVersion: string;
  stored: number;
  models: string[];
  promptVersions: string[];
}

/**
 * The model-evaluation console.
 *
 * Deliberately plain. It is an instrument for the project owner, protected by a token
 * that is held in component state and never persisted, and it refuses loudly rather
 * than degrading into a demo when nothing is configured. There is no mock mode: a
 * fabricated model run would corrupt the one comparison this project exists to make.
 */
export function AIConsole({ scenarios }: { scenarios: Scenario[] }) {
  const [config, setConfig] = useState<Config | null>(null);
  const [token, setToken] = useState("");
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? "");
  const [model, setModel] = useState("");
  /** Held in component state for this page only. Never persisted anywhere. */
  const [apiKey, setApiKey] = useState("");
  const [batchSize, setBatchSize] = useState(1);
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const refresh = () =>
    fetch("/api/ai")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig(null));

  useEffect(() => {
    void refresh();
  }, []);

  async function run() {
    setState("running");
    setMessage(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          scenarioId,
          scenarioIds:
            batchSize > 1
              ? scenarios.slice(scenarios.findIndex((s) => s.id === scenarioId)).slice(0, batchSize).map((s) => s.id)
              : undefined,
          model: model.trim() || undefined,
          apiKey: apiKey.trim() || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
      setState("done");
      setMessage(
        `Stored ${body.ran ?? 1} run${(body.ran ?? 1) === 1 ? "" : "s"}. Prompt version pinned; runs from different prompt versions are never pooled.`,
      );
      void refresh();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "unknown error");
    }
  }

  return (
    <div className="space-y-10">
      <section className="panel p-6 sm:p-8">
        <p className="kicker">Deployment status</p>
        {config === null ? (
          <p className="mt-3 text-[0.9rem] text-faint">Reading configuration…</p>
        ) : (
          <dl className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="kicker">Model API key</dt>
              <dd className={`mt-1 font-mono text-[0.86rem] ${config.configured ? "text-evidence" : "text-accent"}`}>
                {config.configured ? "configured" : "not configured — runs are impossible here"}
              </dd>
            </div>
            <div>
              <dt className="kicker">Research token</dt>
              <dd className={`mt-1 font-mono text-[0.86rem] ${config.tokenConfigured ? "text-evidence" : "text-accent"}`}>
                {config.tokenConfigured ? "configured" : "not set — every run request is refused"}
              </dd>
            </div>
            <div>
              <dt className="kicker">Default model</dt>
              <dd className="mt-1 font-mono text-[0.86rem] text-muted">{config.model}</dd>
            </div>
            <div>
              <dt className="kicker">Prompt version</dt>
              <dd className="mt-1 font-mono text-[0.86rem] text-muted">{config.promptVersion}</dd>
            </div>
            <div>
              <dt className="kicker">Runs stored</dt>
              <dd className="mt-1 font-mono text-[0.86rem] tabular text-muted">{config.stored}</dd>
            </div>
            <div>
              <dt className="kicker">Prompt versions in dataset</dt>
              <dd className="mt-1 font-mono text-[0.86rem] text-muted">
                {config.promptVersions.length ? config.promptVersions.join(", ") : "—"}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <section className="panel p-6 sm:p-8">
        <p className="kicker">Run a scenario</p>
        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-[0.84rem] text-muted">Research token</span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
              placeholder="held in memory for this page only"
              className="w-full border border-line/20 bg-bg px-3 py-2 font-mono text-[0.82rem]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[0.84rem] text-muted">Scenario</span>
            <select
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
              className="w-full border border-line/20 bg-bg px-3 py-2 font-mono text-[0.82rem]"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.track}] {s.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[0.84rem] text-muted">
              Model API key <span className="text-faint">(optional — skips a redeploy)</span>
            </span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
              placeholder={config?.configured ? "using the deployment's key" : "sk-ant-…"}
              className="w-full px-3 py-2 font-mono text-[0.82rem]"
            />
            <span className="mt-1.5 block text-[0.76rem]" style={{ color: "rgb(var(--faint))" }}>
              Used for this request only. Never stored, never written to a result row, and scrubbed
              out of any error the API returns. Leave empty to use ANTHROPIC_API_KEY if one is set.
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[0.84rem] text-muted">
              How many scenarios <span className="text-faint">(from the one selected, onward)</span>
            </span>
            <input
              type="range"
              min={1}
              max={20}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              aria-label="Number of scenarios to run in one batch"
            />
            <span className="mt-1 block font-mono text-[0.8rem] tabular">
              {batchSize} run{batchSize === 1 ? "" : "s"} · about {batchSize * 4} API calls
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[0.84rem] text-muted">
              Model override <span className="text-faint">(optional)</span>
            </span>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={config?.model ?? "default"}
              className="w-full border border-line/20 bg-bg px-3 py-2 font-mono text-[0.82rem]"
            />
          </label>

          <button
            type="button"
            className="btn"
            disabled={state === "running" || !token || !scenarioId || (!config?.configured && !apiKey)}
            onClick={() => void run()}
          >
            {state === "running" ? `Running ${batchSize}…` : `Run ${batchSize} and store`}
          </button>

          {message && (
            <p
              role="status"
              className={`text-[0.86rem] leading-relaxed ${state === "error" ? "text-accent" : "text-evidence"}`}
            >
              {message}
            </p>
          )}
        </div>

        <p className="mt-6 border-t border-line/12 pt-4 text-[0.8rem] leading-relaxed text-faint">
          One run makes one request per stage — four requests for a three-evidence scenario. Failures
          are reported and nothing partial is stored. Repeated runs of the same scenario are kept as
          separate rows, because the spread between them is part of what is being measured.
        </p>
      </section>
    </div>
  );
}
