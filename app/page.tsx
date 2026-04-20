"use client";

import { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import ChatPanel from "@/components/ChatPanel";
import BrowserView from "@/components/BrowserView";
import workflows from "@/lib/workflows";
import { Workflow, StreamEvent } from "@/lib/types";

interface Message {
  id: string;
  text: string;
  type: "system" | "step" | "error" | "paused" | "done" | "running";
}

type WorkflowStatus = "idle" | "running" | "paused" | "error";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("idle");
  const [liveViewUrl, setLiveViewUrl] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runWorkflow = useCallback(async (workflow: Workflow) => {
    if (workflowStatus !== "idle" && workflowStatus !== "paused") return;

    setMessages([]);
    setLiveViewUrl(null);
    setWorkflowStatus("running");

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch("/api/workflows/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId: workflow.id }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text: `Error: ${errorData.error || "Failed to start workflow"}`,
            type: "error",
          },
        ]);
        setWorkflowStatus("error");
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event: StreamEvent = JSON.parse(jsonStr);

            switch (event.type) {
              case "session_created":
                setLiveViewUrl(event.liveViewUrl);
                break;

              case "step_started":
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    text: event.message,
                    type: "running",
                  },
                ]);
                break;

              case "step_completed":
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last && (last.type === "running" || last.type === "step")) {
                    updated[updated.length - 1] = {
                      ...last,
                      type: "step",
                      text: `${last.text} ✓`,
                    };
                  }
                  return updated;
                });
                break;

              case "paused":
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    text: event.message,
                    type: "paused",
                  },
                ]);
                setWorkflowStatus("paused");
                break;

              case "error":
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    text: event.message,
                    type: "error",
                  },
                ]);
                setWorkflowStatus("error");
                break;

              case "done":
                setMessages((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    text: "Workflow complete",
                    type: "done",
                  },
                ]);
                setWorkflowStatus("idle");
                break;
            }
          } catch {
            // ignore invalid JSON
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text: `Connection error: ${err.message}`,
            type: "error",
          },
        ]);
        setWorkflowStatus("error");
      }
    }
  }, [workflowStatus]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[440px] min-w-[360px] flex-shrink-0 border-r border-zinc-800">
          <ChatPanel
            messages={messages}
            workflows={workflows}
            onWorkflowClick={runWorkflow}
            workflowStatus={workflowStatus}
          />
        </div>
        <div className="flex-1">
          <BrowserView
            liveViewUrl={liveViewUrl}
            status={workflowStatus}
          />
        </div>
      </main>
    </div>
  );
}