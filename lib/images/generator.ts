import { readFile } from "fs/promises";
import path from "path";

/**
 * Image generator interface. Implementations can be swapped (e.g. mock → Open Router / Vercel AI).
 */
export interface ImageGenerator {
  generate(description: string): Promise<Buffer>;
}

/**
 * Mock generator: reads public/test.png from disk and returns it for any description.
 * Replace this implementation when integrating real AI (Open Router / Vercel AI).
 */
export async function generateImage(description: string): Promise<Buffer> {
  const filePath = path.join(process.cwd(), "public", "test.png");
  return readFile(filePath);
}
