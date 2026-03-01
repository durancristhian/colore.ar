// middleware.ts
//
// Clerk auth: routes under /imagenes, /feedback, and /api/images, /api/user, /api/feedback
// require sign-in. All other routes (e.g. landing) are public. Matcher skips _next and
// static assets so we don't run auth on every image/CSS request.
//
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/imagenes(.*)",
  "/feedback(.*)",
  "/api/images(.*)",
  "/api/user(.*)",
  "/api/feedback(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
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
