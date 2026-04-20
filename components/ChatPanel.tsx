"use client";

import { Workflow } from "@/lib/types";
import WorkflowPill from "./WorkflowPill";

interface Message {
  id: string;
  text: string;
  type: "system" | "step" | "error" | "paused" | "done" | "running";
}

interface ChatPanelProps {
  messages: Message[];
  workflows: Workflow[];
  onWorkflowClick: (workflow: Workflow) => void;
  workflowStatus: "idle" | "running" | "paused" | "error";
}

export default function ChatPanel({
  messages,
  workflows,
  onWorkflowClick,
  workflowStatus,
}: ChatPanelProps) {
  const isRunning = workflowStatus === "running";

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-zinc-100">
          How can I help today?
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Pick a workflow or type a message
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-zinc-600 italic">
            No activity yet. Click a workflow below to get started.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-sm px-3 py-2 rounded-lg ${
              msg.type === "error"
                ? "bg-red-950/50 text-red-400 border border-red-900/50"
                : msg.type === "paused"
                ? "bg-orange-950/50 text-orange-300 border border-orange-900/50"
                : msg.type === "done"
                ? "bg-emerald-950/50 text-emerald-300 border border-emerald-900/50"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800"
            }`}
          >
            {msg.type === "running" && (
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-2" />
            )}
            {msg.text}
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {workflows.map((workflow) => (
            <WorkflowPill
              key={workflow.id}
              workflow={workflow}
              onClick={onWorkflowClick}
              disabled={isRunning}
            />
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message..."
            disabled={true}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-400 placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors cursor-not-allowed"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">
            coming soon
          </div>
        </div>
      </div>
    </div>
  );
}