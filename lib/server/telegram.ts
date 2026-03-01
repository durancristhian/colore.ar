// telegram.ts
//
// Sends messages to a Telegram chat via the Bot API. Used for feedback form
// submissions so the team gets notified without running a backend queue.
// Requires TELEGRAM_BOTID and TELEGRAM_CHATID; throws if unset or API fails.
//
import { env } from "@/lib/env.server";
import { ErrorCode } from "@/lib/shared/errors";

export class Telegram {
  /**
   * Sends text to the configured chat. Throws if env vars are missing or if the API request fails.
   */
  async sendMessage(message: string): Promise<Response> {
    const text = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOTID}/sendMessage?chat_id=${env.TELEGRAM_CHATID}&text=${text}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Telegram API error (${res.status}): ${res.statusText}`);
      throw new Error(ErrorCode.FEEDBACK_UNAVAILABLE);
    }

    return res;
  }
}
