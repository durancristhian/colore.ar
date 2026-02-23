import { NextRequest, NextResponse } from "next/server";

const UMAMI_SEND_URL = "https://cloud.umami.is/api/send";

export async function POST(request: NextRequest) {
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido" },
      { status: 400 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "application/json";
  const userAgent = request.headers.get("user-agent") ?? "";

  try {
    const response = await fetch(UMAMI_SEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "User-Agent": userAgent,
      },
      body,
    });

    const responseText = await response.text();
    return new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Error del proxy Umami:", error);
    return NextResponse.json(
      { error: "Servicio de analytics no disponible" },
      { status: 503 },
    );
  }
}
