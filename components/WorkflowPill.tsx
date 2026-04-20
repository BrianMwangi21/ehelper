import { Workflow } from "@/lib/types";

interface WorkflowPillProps {
  workflow: Workflow;
  onClick: (workflow: Workflow) => void;
  disabled: boolean;
}

export default function WorkflowPill({
  workflow,
  onClick,
  disabled,
}: WorkflowPillProps) {
  return (
    <button
      onClick={() => onClick(workflow)}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:text-zinc-100 hover:border-orange-500/50 hover:bg-zinc-800 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-zinc-700 disabled:hover:bg-zinc-900 disabled:hover:text-zinc-300"
    >
      <span className="text-sm">{workflow.icon}</span>
      <span>{workflow.label}</span>
    </button>
  );
}