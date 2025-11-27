import { NextResponse } from "next/server";

const protectedRoutes = ["/tasks", "/profile", "/dashboard", "/admin"];
const publicRoutes = ["/login", "/register"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Debug: Log the token to see what we're working with
  console.log("Middleware - Path:", pathname);
  console.log("Middleware - Token exists:", !!token);
  if (token) {
    console.log("Middleware - Token preview:", token.substring(0, 20) + "...");
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    console.log("Middleware: No token, redirecting to login");
    // Set redirect path for smart redirect after login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("redirectPath", pathname, { maxAge: 60, path: "/" }); // 60 seconds
    return response;
  }

  // Protect API routes
  // if (pathname.startsWith("/api") && !token) {
  //   return NextResponse.json(
  //     { message: "Unauthorized: No token provided" },
  //     { status: 401 }
  //   );
  // }

  // Admin route protection
  if (pathname.startsWith("/admin") && token) {
    try {
      // Simple JWT payload extraction
      const payloadBase64Url = token.split(".")[1];

      // Converting from Base64URL to Base64
      const payloadBase64 = payloadBase64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const paddedPayloadBase64 = payloadBase64.padEnd(
        payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4),
        "="
      );

      const payloadJson = atob(paddedPayloadBase64);
      const payload = JSON.parse(payloadJson);

      console.log("Middleware - Decoded JWT payload:", payload);

      if (payload.role !== "admin") {
        console.log("Middleware: User is not admin, redirecting to /tasks");
        return NextResponse.redirect(new URL("/tasks", request.url));
      }

      console.log("Middleware: Admin access granted");
    } catch (error) {
      console.error("Middleware: JWT decoding failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
