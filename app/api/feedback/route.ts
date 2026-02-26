// route.ts
//
// Receives feedback from signed-in users and forwards it to a Telegram chat.
// Used by the feedback form. Requires Clerk auth; uses lib/telegram to send.
//
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Telegram } from "@/lib/telegram";

/**
 * Accepts JSON body with required `message` string. Requires auth. Forwards to Telegram;
 * returns 503 when TELEGRAM_BOTID/TELEGRAM_CHATID are not set (caller shows "temporarily unavailable").
 */
export async function POST(request: NextRequest) {
  const [authResult, user] = await Promise.all([auth(), currentUser()]);
  const userId = authResult.userId;

  if (!userId || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo JSON inválido" },
      { status: 400 },
    );
  }

  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
      ? (body as { message: string }).message.trim()
      : "";

  if (!message) {
    return NextResponse.json(
      { error: "message es requerido y debe ser un string no vacío" },
      { status: 400 },
    );
  }

  const primaryEmail =
    user.emailAddresses.find(({ id }) => id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  const formattedMessage = [
    `User Email: ${primaryEmail}`,
    `User id: ${userId}`,
    `Message: ${message}`,
  ].join("\n");

  try {
    const telegram = new Telegram();
    await telegram.sendMessage(formattedMessage);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes("TELEGRAM_BOTID") &&
      message.includes("TELEGRAM_CHATID")
    ) {
      // Missing env is treated as 503 so the UI can show "temporarily unavailable" instead of a generic error.
      return NextResponse.json(
        { error: "El feedback no está disponible temporalmente." },
        { status: 503 },
      );
    }
    console.error("Feedback send failed:", error);
    return NextResponse.json(
      { error: "Algo salió mal. Por favor, intentá de nuevo." },
      { status: 500 },
    );
  }
}
