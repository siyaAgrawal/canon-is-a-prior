"use client";

import { useState } from "react";
import Link from "next/link";
import type { Scenario } from "@/types";

/**
 * Bring your own key.
 *
 * The model half of this experiment needs an API key, and the project does not
 * have one. Rather than leave that half permanently empty, anyone who already
 * has a key can run a batch and contribute the results — the key is used for
 * that request, never stored, never written to a result row, and scrubbed out of
 * any error the API returns.
 *
 * This is not a proxy to the model API. The prompt is built server-side from a
 * fixed template and a fixed scenario; nothing from this form reaches it.
 */
export function ContributeRun({ scenarios }: { scenarios: Scenario[] }) {
  const [apiKey, setApiKey] = useState("");
  const [count, setCount] = useState(3);
  const [model, setModel] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setState("running");
    setMessage(null);
    try {
      const picked = [...scenarios].sort(() => Math.random() - 0.5).slice(0, count).map((s) => s.id);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenarioIds: picked,
          scenarioId: picked[0],
          apiKey: apiKey.trim(),
          model: model.trim() || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
      setState("done");
      setMessage(
        `${body.ran} run${body.ran === 1 ? "" : "s"} stored. They appear on the comparison above and in the findings.`,
      );
      setApiKey("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "unknown error");
    }
  }

  return (
    <div className="panel p-6 sm:p-8">
      <p className="kicker" style={{ color: "rgb(var(--accent))" }}>
        Contribute a model run
      </p>
      <h3 className="mt-3 font-display text-d4">This half needs a key. It does not need mine.</h3>
      <p className="say mt-5 max-w-measure text-[0.96rem]">
        If you have an Anthropic API key, you can run a few scenarios and add the results to the
        dataset. It costs a few cents of your own credit and takes about a minute.
      </p>

      <div className="mt-8 space-y-6">
        <label className="block">
          <span className="mb-1.5 block text-[0.86rem]" style={{ color: "rgb(var(--muted))" }}>
            Your API key
          </span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            autoComplete="off"
            placeholder="sk-ant-…"
            className="w-full px-3 py-2.5 font-mono text-[0.84rem]"
          />
          <span className="mt-2 block max-w-measure text-[0.78rem] leading-relaxed" style={{ color: "rgb(var(--faint))" }}>
            Sent once over HTTPS, used for this request, and discarded. Never stored, never attached
            to a result, and removed from any error text before it comes back. The prompt is built on
            the server from a fixed template — nothing you type here reaches the model, because there
            is nothing you can type that would.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.86rem]" style={{ color: "rgb(var(--muted))" }}>
            Scenarios, chosen at random
          </span>
          <input
            type="range"
            min={1}
            max={6}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            aria-label="How many scenarios to run"
            style={{ color: "rgb(var(--accent))" }}
          />
          <span className="mt-1 block font-mono text-[0.82rem] tabular">
            {count} scenario{count === 1 ? "" : "s"} · roughly {count * 4} API calls
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[0.86rem]" style={{ color: "rgb(var(--muted))" }}>
            Model <span style={{ color: "rgb(var(--faint))" }}>(optional)</span>
          </span>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="claude-sonnet-5"
            className="w-full px-3 py-2.5 font-mono text-[0.82rem]"
          />
        </label>

        <button type="button" className="btn btn-solid" disabled={state === "running" || !apiKey.trim()} onClick={() => void run()}>
          {state === "running" ? `Running ${count}…` : `Run ${count} and contribute`}
        </button>

        {message && (
          <p role="status" className="max-w-measure text-[0.88rem] leading-relaxed" style={{ color: state === "error" ? "rgb(var(--accent))" : "#6AAD89" }}>
            {message}
          </p>
        )}
      </div>

      <p className="mt-8 border-t pt-5 max-w-measure text-[0.8rem] leading-relaxed" style={{ borderColor: "rgb(var(--line) / 0.15)", color: "rgb(var(--faint))" }}>
        Every run records the model identifier and a prompt version, and runs from different prompt
        versions are never pooled. What gets stored is on the{" "}
        <Link href="/ethics" className="underline decoration-dotted underline-offset-2">
          ethics page
        </Link>
        .
      </p>
    </div>
  );
}
