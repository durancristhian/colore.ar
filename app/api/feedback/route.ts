import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Telegram } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const user = await currentUser();

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
