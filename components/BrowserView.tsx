"use client";

import { useState } from "react";

interface BrowserViewProps {
  liveViewUrl: string | null;
  status: "idle" | "running" | "paused" | "error";
}

export default function BrowserView({ liveViewUrl, status }: BrowserViewProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-zinc-800">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800 bg-zinc-950">
        <div className="flex gap-1.5">
          <div className={`w-3 h-3 rounded-full ${liveViewUrl ? "bg-emerald-600" : "bg-zinc-800"}`} />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
          <div className="w-3 h-3 rounded-full bg-zinc-800" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-zinc-600 font-mono">
            {status === "running" && !liveViewUrl
              ? "starting session..."
              : liveViewUrl && !iframeLoaded
              ? "loading browser..."
              : liveViewUrl
              ? "live session"
              : "no session"}
          </span>
        </div>
      </div>

      <div className="flex-1 relative">
        {liveViewUrl ? (
          <>
            <iframe
              src={liveViewUrl}
              sandbox="allow-same-origin allow-scripts"
              allow="clipboard-read; clipboard-write"
              className="w-full h-full border-0 bg-zinc-900"
              onLoad={() => setIframeLoaded(true)}
            />
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-zinc-400">
                    Loading browser session...
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-600"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">
              Start a workflow to begin browsing
            </p>
            <p className="text-xs text-zinc-700 mt-1">
              A live browser session will appear here
            </p>
          </div>
        )}

        {status === "running" && !liveViewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-zinc-400">
                Starting browser session...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}