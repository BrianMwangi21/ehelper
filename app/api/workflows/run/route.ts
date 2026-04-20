import { createStagehandInstance } from "@/lib/stagehand";
import { getLiveViewUrl } from "@/lib/browserbase";
import workflows from "@/lib/workflows";
import { Workflow, WorkflowStepAct, StreamEvent } from "@/lib/types";

function getWorkflow(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}

const DEFAULT_MAX_RETRIES = 3;

export async function POST(request: Request) {
  const body = await request.json();
  const workflowId = body.workflowId as string;

  if (!workflowId) {
    return Response.json({ error: "workflowId is required" }, { status: 400 });
  }

  const workflow = getWorkflow(workflowId);
  if (!workflow) {
    return Response.json(
      { error: `Workflow "${workflowId}" not found` },
      { status: 404 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      let stagehand: Awaited<ReturnType<typeof createStagehandInstance>> | null =
        null;

      try {
        send({ type: "step_started", step: -1, message: "Creating browser session..." });

        stagehand = createStagehandInstance();
        await stagehand.init();

        const sessionId = stagehand.browserbaseSessionId!;
        const liveViewUrl = await getLiveViewUrl(sessionId);

        send({ type: "session_created", sessionId, liveViewUrl });

        const page = stagehand.context.pages()[0];

        for (const [i, step] of workflow.steps.entries()) {
          send({ type: "step_started", step: i, message: step.message });

          if (step.action === "goto") {
            await page.goto(step.url, { waitUntil: "domcontentloaded" });
            send({ type: "step_completed", step: i });
          } else if (step.action === "act") {
            const maxRetries = step.maxRetries ?? DEFAULT_MAX_RETRIES;
            let succeeded = false;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              try {
                if (attempt > 1) {
                  send({
                    type: "step_started",
                    step: i,
                    message: `${step.message} (retry ${attempt}/${maxRetries})`,
                  });
                }
                await stagehand.act(step.prompt);
                send({ type: "step_completed", step: i });
                succeeded = true;
                break;
              } catch (err) {
                const errMsg = err instanceof Error ? err.message : String(err);
                if (attempt < maxRetries) {
                  send({
                    type: "step_started",
                    step: i,
                    message: `Failed attempt ${attempt}/${maxRetries}. Retrying...`,
                  });
                } else {
                  send({
                    type: "paused",
                    step: i,
                    message: `Could not complete "${step.prompt}" automatically after ${maxRetries} attempts. Please try doing it manually in the browser window.`,
                  });
                  succeeded = true;
                  break;
                }
              }
            }

            if (!succeeded) {
              break;
            }
          } else if (step.action === "pause") {
            send({ type: "paused", step: i, message: step.message });
            break;
          }
        }

        send({ type: "done" });
      } catch (error) {
        send({
          type: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}