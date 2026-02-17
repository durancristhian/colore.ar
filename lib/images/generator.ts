import { generateImage as generateImageWithModel } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/**
 * Image generator interface. Implementations can be swapped (e.g. mock → Open Router / Vercel AI).
 */
export interface ImageGenerator {
  generate(description: string): Promise<Buffer>;
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (value == null || value.trim() === "") {
    throw new Error(
      `Missing or empty environment variable: ${name}. Image generation requires OPEN_ROUTER_API_KEY and OPEN_ROUTER_IMAGE_MODEL.`
    );
  }
  return value.trim();
}

/**
 * Builds the full prompt from the user description and optional PROMPT_SUFFIX env.
 */
function buildPrompt(description: string): string {
  const trimmed = description.trim();
  const suffix = process.env.PROMPT_SUFFIX?.trim();
  if (!suffix) return trimmed;
  return trimmed ? `${trimmed} ${suffix}` : suffix;
}

/**
 * Generates an image from a text description using the Vercel AI SDK and Open Router.
 * Uses OPEN_ROUTER_IMAGE_MODEL and OPEN_ROUTER_API_KEY (required). Optionally appends PROMPT_SUFFIX to the prompt.
 * OPEN_ROUTER_IMAGE_MODEL must be an image-capable model (e.g. google/gemini-2.5-flash-image).
 * See https://openrouter.ai/models?output_modalities=image
 */
export async function generateImage(description: string): Promise<Buffer> {
  const fullPrompt = buildPrompt(description);
  const apiKey = getEnv("OPEN_ROUTER_API_KEY");
  const modelId = getEnv("OPEN_ROUTER_IMAGE_MODEL");
  const model = createOpenRouter({ apiKey }).imageModel(modelId);
  const result = await generateImageWithModel({
    model,
    prompt: fullPrompt,
    n: 1,
  });
  const first = result.images[0];
  if (!first) {
    throw new Error("No image generated");
  }
  return Buffer.from(first.uint8Array);
}

function getPollinationsApiKey(): string {
  const value = process.env.POLLINATIONS_API_KEY;
  if (value == null || value.trim() === "") {
    throw new Error(
      "Missing or empty environment variable: POLLINATIONS_API_KEY. Required for image generation when not in production."
    );
  }
  return value.trim();
}

/**
 * Generates an image from a text description using Pollinations (flux model).
 * Used when NODE_ENV is not production. Uses buildPrompt for PROMPT_SUFFIX consistency.
 * Requires POLLINATIONS_API_KEY.
 * See https://gen.pollinations.ai/
 */
export async function generateImageWithPollinations(
  description: string
): Promise<Buffer> {
  const fullPrompt = buildPrompt(description);
  const apiKey = getPollinationsApiKey();
  const url = `https://gen.pollinations.ai/image/${encodeURIComponent(fullPrompt)}?model=flux`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) {
    throw new Error(
      `Pollinations image generation failed: ${response.status} ${response.statusText}`
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Picks the image generator by NODE_ENV: production uses Open Router (generateImage),
 * non-production uses Pollinations (generateImageWithPollinations). Same return type for both.
 */
export async function generateImageForEnv(description: string): Promise<Buffer> {
  if (process.env.NODE_ENV === "production") {
    return generateImage(description);
  }
  return generateImageWithPollinations(description);
}
