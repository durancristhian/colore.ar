// telegram.ts
//
// Sends messages to a Telegram chat via the Bot API. Used by app/api/feedback.
// Requires TELEGRAM_BOTID and TELEGRAM_CHATID; rejects if unset (caller should map to 503).
//
export class Telegram {
  /**
   * Sends text to the configured chat. Rejects if env vars are missing (caller should return 503).
   */
  sendMessage(message: string) {
    return new Promise<Response>(async (resolve, reject) => {
      try {
        const botId = process.env.TELEGRAM_BOTID;
        const chatId = process.env.TELEGRAM_CHATID;

        if (!botId || !chatId) {
          reject(
            `'TELEGRAM_BOTID' and 'TELEGRAM_CHATID' env vars are not configured`,
          );

          return;
        }

        const text = encodeURIComponent(message);

        const res = await fetch(
          `https://api.telegram.org/bot${botId}/sendMessage?chat_id=${chatId}&text=${text}`,
        );

        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }
}
