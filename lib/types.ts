export interface WorkflowStepGoto {
  action: "goto";
  url: string;
  message: string;
}

export interface WorkflowStepAct {
  action: "act";
  prompt: string;
  message: string;
  maxRetries?: number;
}

export interface WorkflowStepPause {
  action: "pause";
  message: string;
}

export type WorkflowStep = WorkflowStepGoto | WorkflowStepAct | WorkflowStepPause;

export interface Workflow {
  id: string;
  label: string;
  icon: string;
  steps: WorkflowStep[];
}

export interface SessionInfo {
  sessionId: string;
  liveViewUrl: string;
}

export type StreamEvent =
  | { type: "session_created"; sessionId: string; liveViewUrl: string }
  | { type: "step_started"; step: number; message: string }
  | { type: "step_completed"; step: number }
  | { type: "paused"; step: number; message: string }
  | { type: "error"; message: string }
  | { type: "done" };