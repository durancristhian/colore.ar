import { ErrorCode } from "@/lib/shared/errors";

export class Telegram {
  /**
   * Sends text to the configured chat. Throws if env vars are missing or if the API request fails.
   */
  async sendMessage(message: string): Promise<Response> {
    const botId = process.env.TELEGRAM_BOTID;
    const chatId = process.env.TELEGRAM_CHATID;

    if (!botId || !chatId) {
      throw new Error(ErrorCode.TELEGRAM_NOT_CONFIGURED);
    }

    const text = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${botId}/sendMessage?chat_id=${chatId}&text=${text}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Telegram API error (${res.status}): ${res.statusText}`);
      throw new Error(ErrorCode.FEEDBACK_UNAVAILABLE);
    }

    return res;
  }
}
