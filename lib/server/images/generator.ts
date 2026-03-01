// generator.ts
//
// Text-to-image (Open Router + Pollinations) and image-to-image (Open Router). Each function documents its required env vars.
//
import { generateImage as generateImageWithModel } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/** Implementations can be swapped (e.g. mock, Open Router, Vercel AI). */
export interface ImageGenerator {
  generate(description: string): Promise<Buffer>;
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (value == null || value.trim() === "") {
    throw new Error(
      `Missing or empty environment variable: ${name}. Image generation requires OPEN_ROUTER_API_KEY and OPEN_ROUTER_IMAGE_MODEL.`,
    );
  }
  return value.trim();
}

/** Builds prompt from PROMPT_PREFIX + quoted description + PROMPT_SUFFIX (env-driven). */
function buildPrompt(description: string): string {
  const trimmed = description.trim();
  const prefix = process.env.PROMPT_PREFIX?.trim() ?? "";
  const suffix = process.env.PROMPT_SUFFIX?.trim() ?? "";
  const quoted = `"${trimmed}"`;
  const parts = [prefix, quoted, suffix].map((s) => s.trim()).filter(Boolean);
  return parts.join(" ");
}

/** Builds prompt for image-to-image from PROMPT_IMAGE_PREFIX + PROMPT_SUFFIX. */
function buildPromptFromImage(): string {
  const prefix = process.env.PROMPT_IMAGE_PREFIX?.trim() ?? "";
  const suffix = process.env.PROMPT_SUFFIX?.trim() ?? "";
  const parts = [prefix, suffix].map((s) => s.trim()).filter(Boolean);
  return parts.join(" ");
}

/**
 * Generates an image from a text description via Open Router. Requires OPEN_ROUTER_API_KEY and OPEN_ROUTER_IMAGE_MODEL. Throws if no image is returned.
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
      "Missing or empty environment variable: POLLINATIONS_API_KEY. Required for image generation when not in production.",
    );
  }
  return value.trim();
}

/**
 * Generates an image from a text description via Pollinations (flux). Requires POLLINATIONS_API_KEY. Uses same prompt building as generateImage.
 */
export async function generateImageWithPollinations(
  description: string,
): Promise<Buffer> {
  const fullPrompt = buildPrompt(description);
  const apiKey = getPollinationsApiKey();
  const url = `https://gen.pollinations.ai/image/${encodeURIComponent(fullPrompt)}?model=flux`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) {
    throw new Error(
      `Pollinations image generation failed: ${response.status} ${response.statusText}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generates an image from a source image URL via Open Router (image-to-image). Requires OPEN_ROUTER_API_KEY and OPEN_ROUTER_IMAGE_MODEL. Throws if no image is returned.
 */
export async function generateImageFromImage(
  sourceImageUrl: string,
): Promise<Buffer> {
  const fullPrompt = buildPromptFromImage();
  const apiKey = getEnv("OPEN_ROUTER_API_KEY");
  const modelId = getEnv("OPEN_ROUTER_IMAGE_MODEL");
  const model = createOpenRouter({ apiKey }).imageModel(modelId);

  const result = await generateImageWithModel({
    model,
    prompt: { text: fullPrompt, images: [sourceImageUrl] },
    n: 1,
  });

  const first = result.images[0];
  if (!first) {
    throw new Error("No image generated");
  }
  return Buffer.from(first.uint8Array);
}
