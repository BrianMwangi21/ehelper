import { Stagehand, AISdkClient } from "@browserbasehq/stagehand";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function createStagehandInstance(): Stagehand {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
  });

  const model = openrouter(process.env.MODEL || "openrouter/free");

  const llmClient = new AISdkClient({ model });

  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    llmClient,
    verbose: 1,
  });

  return stagehand;
}