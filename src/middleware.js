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
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
// import { NextResponse } from "next/server";

// const protectedRoutes = ["/tasks", "/profile", "/dashboard", "/admin"];
// const publicRoutes = ["/login", "/register"];

// // const JWT_SECRET = new TextEncoder().encode(
// //   process.env.JWT_SECRET || "supersecretkey"
// // );

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value;
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );
//   const isPublicRoute = publicRoutes.includes(pathname);

//   if (isProtectedRoute && !token) {
//     console.log("Middleware: Redirecting to login from", pathname);
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // if (isPublicRoute && token) {
//   //   console.log(
//   //     "Middleware: Redirecting authenticated user to /tasks from",
//   //     pathname
//   //   );
//   //   return NextResponse.redirect(new URL("/tasks", request.url));
//   // }

//   if (pathname.startsWith("/admin") && token) {
//     try {
//       const payload = jwt.verify(token, JWT_SECRET);
//       if (payload.role !== "admin") {
//         console.log(
//           "Middleware: Non-admin user trying to access /admin, redirecting to /tasks"
//         );
//         return NextResponse.redirect(new URL("/tasks", request.url));
//       }
//     } catch (err) {
//       console.log("Middleware: Invalid token on /admin, redirecting to login");
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   //Protects all pages except API calls, static assets, Next.js internal files, favicon
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
