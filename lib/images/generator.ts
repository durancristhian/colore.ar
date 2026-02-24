import { generateImage as generateImageWithModel, generateText } from "ai";
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
      `Missing or empty environment variable: ${name}. Image generation requires OPEN_ROUTER_API_KEY and OPEN_ROUTER_IMAGE_MODEL.`,
    );
  }
  return value.trim();
}

/**
 * Builds the full prompt as: optional PROMPT_PREFIX + description + optional PROMPT_SUFFIX.
 * Parts are trimmed and joined with a single space.
 */
function buildPrompt(description: string): string {
  const trimmed = description.trim();
  const prefix = process.env.PROMPT_PREFIX?.trim() ?? "";
  const suffix = process.env.PROMPT_SUFFIX?.trim() ?? "";
  const quoted = `"${trimmed}"`;
  const parts = [prefix, quoted, suffix].map((s) => s.trim()).filter(Boolean);
  return parts.join(" ");
}

/**
 * Builds the prompt for image-to-image: PROMPT_IMAGE_PREFIX + PROMPT_SUFFIX joined with a space.
 * Used when generating from an uploaded image (Open Router image-to-image).
 */
function buildPromptFromImage(): string {
  const prefix = process.env.PROMPT_IMAGE_PREFIX?.trim() ?? "";
  const suffix = process.env.PROMPT_SUFFIX?.trim() ?? "";
  const parts = [prefix, suffix].map((s) => s.trim()).filter(Boolean);
  return parts.join(" ");
}

/**
 * Generates an image from a text description using the Vercel AI SDK and Open Router.
 * Uses OPEN_ROUTER_IMAGE_MODEL and OPEN_ROUTER_API_KEY (required). Optionally prepends PROMPT_PREFIX and appends PROMPT_SUFFIX to the prompt.
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
      "Missing or empty environment variable: POLLINATIONS_API_KEY. Required for image generation when not in production.",
    );
  }
  return value.trim();
}

/**
 * Generates an image from a text description using Pollinations (flux model).
 * Uses buildPrompt for PROMPT_PREFIX/PROMPT_SUFFIX consistency.
 * Requires POLLINATIONS_API_KEY.
 * See https://gen.pollinations.ai/
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
 * Generates an image from a source image URL using Open Router (image-to-image).
 * Uses generateText with a chat model that accepts image input and returns image output.
 * Requires OPEN_ROUTER_API_KEY and OPEN_ROUTER_IMAGE_MODEL (image-capable chat model, e.g. google/gemini-3-pro-image-preview).
 */
export async function generateImageFromImage(
  sourceImageUrl: string,
): Promise<Buffer> {
  const fullPrompt = buildPromptFromImage();
  const apiKey = getEnv("OPEN_ROUTER_API_KEY");
  const modelId = getEnv("OPEN_ROUTER_IMAGE_MODEL");
  const openrouter = createOpenRouter({ apiKey });

  const result = await generateText({
    model: openrouter.chat(modelId),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: fullPrompt },
          { type: "image", image: new URL(sourceImageUrl) },
        ],
      },
    ],
    providerOptions: {
      openrouter: { modalities: ["image", "text"] },
    },
  });

  const imageFile = result.files?.find((f) =>
    f.mediaType?.startsWith("image/"),
  );
  if (!imageFile) {
    throw new Error("No image generated");
  }
  return Buffer.from(imageFile.uint8Array);
}
