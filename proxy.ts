import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/api/send"]);
// Protect only known auth routes; unknown paths fall through and can 404. Update when adding new pages/API under (authenticated) or auth-required APIs.
const isProtectedRoute = createRouteMatcher([
  "/imagenes(.*)", // /imagenes, /imagenes/nueva, /imagenes/[id]
  "/feedback(.*)",
  "/api/images(.*)",
  "/api/user(.*)", // /api/user/me
  "/api/feedback(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
