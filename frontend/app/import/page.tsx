"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Status = { type: "idle" | "loading" | "success" | "error"; message?: string };

export default function ImportPage() {
  const [readwiseToken, setReadwiseToken] = useState("");
  const [rwStatus, setRwStatus] = useState<Status>({ type: "idle" });
  const [clippingsFile, setClippingsFile] = useState<File | null>(null);
  const [clippingsStatus, setClippingsStatus] = useState<Status>({ type: "idle" });

  async function importReadwise(e: React.FormEvent) {
    e.preventDefault();
    if (!readwiseToken.trim()) return;
    setRwStatus({ type: "loading" });
    try {
      const res = await fetch(`${API}/api/import/readwise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_token: readwiseToken.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Import failed");
      setRwStatus({
        type: "success",
        message: `Imported ${data.imported_books} book(s) and ${data.imported_excerpts} highlight(s)!`,
      });
    } catch (err: unknown) {
      setRwStatus({ type: "error", message: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  async function importClippings(e: React.FormEvent) {
    e.preventDefault();
    if (!clippingsFile) return;
    setClippingsStatus({ type: "loading" });
    try {
      const form = new FormData();
      form.append("file", clippingsFile);
      const res = await fetch(`${API}/api/import/clippings`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Import failed");
      setClippingsStatus({
        type: "success",
        message: `Imported ${data.imported_books} book(s) and ${data.imported_excerpts} highlight(s)!`,
      });
    } catch (err: unknown) {
      setClippingsStatus({ type: "error", message: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import Highlights</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Bring in your Kindle highlights to populate your feed.
        </p>
      </div>

      {/* Readwise import */}
      <section className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-amber-500">
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Readwise</h2>
            <p className="text-xs text-gray-500">Syncs all your Kindle highlights automatically</p>
          </div>
        </div>

        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Go to <strong>readwise.io/access_token</strong> to get your token</li>
          <li>Make sure the Readwise browser extension has synced your Kindle highlights</li>
          <li>Paste your token below and click Import</li>
        </ol>

        <form onSubmit={importReadwise} className="space-y-3">
          <input
            type="password"
            placeholder="Paste your Readwise API token..."
            value={readwiseToken}
            onChange={(e) => setReadwiseToken(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button
            type="submit"
            disabled={rwStatus.type === "loading" || !readwiseToken.trim()}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {rwStatus.type === "loading" ? "Importing…" : "Import from Readwise"}
          </button>
        </form>

        <StatusMessage status={rwStatus} />
      </section>

      {/* My Clippings.txt import */}
      <section className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-stone-500">
              <path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" />
              <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 0 0 1.06-1.06l-1.047-1.048A3.375 3.375 0 1 0 11.625 18Z" clipRule="evenodd" />
              <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">My Clippings.txt</h2>
            <p className="text-xs text-gray-500">Upload the file from your physical Kindle device</p>
          </div>
        </div>

        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Connect your Kindle to your computer via USB</li>
          <li>Find <code className="bg-stone-100 px-1 rounded text-xs">documents/My Clippings.txt</code></li>
          <li>Upload it below</li>
        </ol>

        <form onSubmit={importClippings} className="space-y-3">
          <label className="block w-full border-2 border-dashed border-stone-200 rounded-xl p-6 text-center cursor-pointer hover:border-rose-300 transition-colors">
            <input
              type="file"
              accept=".txt"
              className="sr-only"
              onChange={(e) => setClippingsFile(e.target.files?.[0] ?? null)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 mx-auto mb-2 fill-stone-300">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
            {clippingsFile ? (
              <p className="text-sm text-gray-700 font-medium">{clippingsFile.name}</p>
            ) : (
              <p className="text-sm text-gray-400">Click to select My Clippings.txt</p>
            )}
          </label>

          <button
            type="submit"
            disabled={clippingsStatus.type === "loading" || !clippingsFile}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {clippingsStatus.type === "loading" ? "Importing…" : "Import Clippings"}
          </button>
        </form>

        <StatusMessage status={clippingsStatus} />
      </section>
    </div>
  );
}

function StatusMessage({ status }: { status: Status }) {
  if (status.type === "idle" || status.type === "loading") return null;
  return (
    <p className={`text-sm rounded-lg px-3 py-2 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
      {status.message}
    </p>
  );
}
