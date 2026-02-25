"use client";

/**
 * Catches errors in the root layout (e.g. ClerkProvider, font, body).
 * Replaces the entire document — no app styles or fonts.
 * Must include <html> and <body>.
 *
 * How to test:
 * 1. Temporarily throw in app/layout.tsx (e.g. inside RootLayout: throw new Error("test")).
 * 2. Restart dev server and open /. You should see this page.
 * 3. Remove the throw and verify the app works again.
 */
export default function GlobalError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            maxWidth: "28rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
              Algo salió mal
            </h1>
            <p style={{ margin: 0 }}>
              Ocurrió un error inesperado. Podés intentar de nuevo o volver al
              inicio.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Intentar de nuevo
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "0.5rem 1rem",
                color: "inherit",
              }}
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
