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
