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
        body: JSON.stringify({ scenarioId, model: model.trim() || undefined }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
      setState("done");
      setMessage(`Stored run ${body.response.id} for ${body.response.model} (prompt ${body.response.promptVersion}).`);
      void refresh();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "unknown error");
    }
  }

  return (
    <div className="space-y-10">
      <section className="card p-6 sm:p-8">
        <p className="eyebrow">Deployment status</p>
        {config === null ? (
          <p className="mt-3 text-[0.9rem] text-ink-faint">Reading configuration…</p>
        ) : (
          <dl className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Model API key</dt>
              <dd className={`mt-1 font-mono text-[0.86rem] ${config.configured ? "text-moss" : "text-rust"}`}>
                {config.configured ? "configured" : "not configured — runs are impossible here"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Research token</dt>
              <dd className={`mt-1 font-mono text-[0.86rem] ${config.tokenConfigured ? "text-moss" : "text-rust"}`}>
                {config.tokenConfigured ? "configured" : "not set — every run request is refused"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Default model</dt>
              <dd className="mt-1 font-mono text-[0.86rem] text-ink-soft">{config.model}</dd>
            </div>
            <div>
              <dt className="eyebrow">Prompt version</dt>
              <dd className="mt-1 font-mono text-[0.86rem] text-ink-soft">{config.promptVersion}</dd>
            </div>
            <div>
              <dt className="eyebrow">Runs stored</dt>
              <dd className="mt-1 font-mono text-[0.86rem] tabular text-ink-soft">{config.stored}</dd>
            </div>
            <div>
              <dt className="eyebrow">Prompt versions in dataset</dt>
              <dd className="mt-1 font-mono text-[0.86rem] text-ink-soft">
                {config.promptVersions.length ? config.promptVersions.join(", ") : "—"}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <section className="card p-6 sm:p-8">
        <p className="eyebrow">Run a scenario</p>
        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-[0.84rem] text-ink-soft">Research token</span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
              placeholder="held in memory for this page only"
              className="w-full border border-rule bg-paper px-3 py-2 font-mono text-[0.82rem]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[0.84rem] text-ink-soft">Scenario</span>
            <select
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
              className="w-full border border-rule bg-paper px-3 py-2 font-mono text-[0.82rem]"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.track}] {s.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[0.84rem] text-ink-soft">
              Model override <span className="text-ink-ghost">(optional)</span>
            </span>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={config?.model ?? "default"}
              className="w-full border border-rule bg-paper px-3 py-2 font-mono text-[0.82rem]"
            />
          </label>

          <button
            type="button"
            className="btn"
            disabled={state === "running" || !token || !scenarioId}
            onClick={() => void run()}
          >
            {state === "running" ? "Running…" : "Run and store"}
          </button>

          {message && (
            <p
              role="status"
              className={`text-[0.86rem] leading-relaxed ${state === "error" ? "text-rust" : "text-moss"}`}
            >
              {message}
            </p>
          )}
        </div>

        <p className="mt-6 border-t border-rule-soft pt-4 text-[0.8rem] leading-relaxed text-ink-ghost">
          One run makes one request per stage — four requests for a three-evidence scenario. Failures
          are reported and nothing partial is stored. Repeated runs of the same scenario are kept as
          separate rows, because the spread between them is part of what is being measured.
        </p>
      </section>
    </div>
  );
}
