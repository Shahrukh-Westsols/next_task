import { NextResponse } from "next/server";

const protectedRoutes = ["/tasks", "/profile", "/dashboard", "/admin"];
const publicRoutes = ["/login", "/register"];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey"
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isProtectedRoute && !token) {
    console.log("Middleware: Redirecting to login from", pathname);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if (isPublicRoute && token) {
  //   console.log(
  //     "Middleware: Redirecting authenticated user to /tasks from",
  //     pathname
  //   );
  //   return NextResponse.redirect(new URL("/tasks", request.url));
  // }

  if (pathname.startsWith("/admin") && token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload.role !== "admin") {
        console.log(
          "Middleware: Non-admin user trying to access /admin, redirecting to /tasks"
        );
        return NextResponse.redirect(new URL("/tasks", request.url));
      }
    } catch (err) {
      console.log("Middleware: Invalid token on /admin, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  //Protects all pages except API calls, static assets, Next.js internal files, favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
