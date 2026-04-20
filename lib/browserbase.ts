import Browserbase from "@browserbasehq/sdk";

export function getBrowserbaseClient(): Browserbase {
  return new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY!,
  });
}

export async function getLiveViewUrl(sessionId: string): Promise<string> {
  const bb = getBrowserbaseClient();
  const liveUrls = await bb.sessions.debug(sessionId);
  return liveUrls.debuggerFullscreenUrl;
}