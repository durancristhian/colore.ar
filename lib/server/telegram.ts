// telegram.ts
//
// Sends messages to a Telegram chat via the Bot API. Used by app/api/feedback.
// Requires TELEGRAM_BOTID and TELEGRAM_CHATID; rejects if unset (caller should map to 503).
//
export class Telegram {
  /**
   * Sends text to the configured chat. Throws if env vars are missing or if the API request fails.
   */
  async sendMessage(message: string): Promise<Response> {
    const botId = process.env.TELEGRAM_BOTID;
    const chatId = process.env.TELEGRAM_CHATID;

    if (!botId || !chatId) {
      throw new Error("Configuración de Telegram incompleta");
    }

    const text = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${botId}/sendMessage?chat_id=${chatId}&text=${text}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Telegram API error (${res.status}): ${res.statusText}`);
      throw new Error("No se pudo enviar el feedback");
    }

    return res;
  }
}
