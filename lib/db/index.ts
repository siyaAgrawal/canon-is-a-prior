import { FileStore } from "./file-store";
import { PostgresStore } from "./postgres-store";
import { BlobStore, blobConfigured } from "./blob-store";
import type { ExperimentStore } from "./store";

let cached: ExperimentStore | null = null;

/**
 * Serverless platforms give each invocation a filesystem that does not survive it.
 * The file store would accept a write there, report success, and lose the row — and a
 * participant told "response recorded" whose response was not recorded is the precise
 * failure this project is organised against. So on those platforms, with no database
 * configured, we refuse writes loudly instead.
 */
export function isEphemeralFilesystem(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "This deployment has no durable store attached, and its filesystem does not persist between requests. Rather than tell you your response was recorded and then lose it, nothing was stored. Attach a Blob store or set DATABASE_URL to collect responses.",
    );
    this.name = "StorageNotConfiguredError";
  }
}

export function storageStatus(): {
  usable: boolean;
  kind: "file" | "postgres" | "blob" | "none";
  reason?: string;
  detail?: string;
} {
  const url = process.env.DATABASE_URL;
  if (url && url.trim().length > 0) return { usable: true, kind: "postgres" };
  if (blobConfigured()) return { usable: true, kind: "blob" };
  if (isEphemeralFilesystem()) {
    return {
      usable: false,
      kind: "none",
      // Two audiences: `reason` is shown to visitors, `detail` is for whoever runs it.
      reason: "This deployment doesn't have a database attached yet, so responses can't be stored.",
      detail: "No DATABASE_URL is set, and this platform's filesystem does not persist between requests.",
    };
  }
  return { usable: true, kind: "file" };
}

export function getStore(): ExperimentStore {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (url && url.trim().length > 0) {
    cached = new PostgresStore(url);
    return cached;
  }
  // Blob is the default durable backend: it needs no separate account and is
  // provisioned against the deployment itself.
  if (blobConfigured()) {
    cached = new BlobStore();
    return cached;
  }
  if (isEphemeralFilesystem()) throw new StorageNotConfiguredError();
  cached = new FileStore();
  return cached;
}

/** Reads tolerate missing storage: an empty dataset and no dataset look the same to a reader. */
export function getStoreOrNull(): ExperimentStore | null {
  try {
    return getStore();
  } catch {
    return null;
  }
}

export type { ExperimentStore };
